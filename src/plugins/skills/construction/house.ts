import {
    instance1, instance1Max,
    instance1PohSpawn, instance2, instance2Max,
    MAP_SIZE, roomTemplates, RoomType
} from '@plugins/skills/construction/con-constants';
import { Position } from '@engine/world/position';
import { ConstructedChunk, ConstructedRegion } from '@engine/world/map/region';
import { Player } from '@engine/world/actor/player/player';
import { loadHouse } from '@plugins/skills/construction/home-saver';
import { activeWorld, WorldInstance } from '@engine/world';
import { findObject, widgets } from '@engine/config/config-handler';
import uuidv4 from 'uuid/v4';
import { Furniture } from './types';
import { LandscapeObject } from '@runejs/filestore';
import { ROOM_CONFIG } from './data';
import { logger } from '@runejs/common';
import { rotateChunkCoordinate } from './util/rotations';

export const openHouseWithWelcome = (player: Player): void => {
    player.interfaceState.openWidget(widgets.poh.noPlaceLikeHome, {
        slot: 'screen'
    });

    openHouse(player);

    player.sendMessage(`Welcome home.`);
    setTimeout(() => {
        player.interfaceState.closeAllSlots();
    }, 500);
}

export const exitHouse = (player: Player): void => {
    player.sendMessage('you exit the house')
    if(
        player.position.within(instance1, instance1Max, false) ||
        player.position.within(instance2, instance2Max, false)
    ) {
        player.position = new Position(2954, 3225, 0);
    }
}

/**
 * Creates a house instance, spawns the player into it, and loads the furniture.
 *
 * @param player the player
 * @param inBuildMode If false, the furniture placeholders will be replaced with the correct objects.
 */
export const openHouse = (player: Player, inBuildMode = false): void => {
    player.instance = new WorldInstance(uuidv4());

    let pohPosition: Position = instance1;
    let playerSpawn: Position = instance1PohSpawn;

    if(player.position.within(instance1, instance1Max, false)) {
        playerSpawn = player.position.copy().setY(player.position.y + 64);
        pohPosition = instance2;
    } else if(player.position.within(instance2, instance2Max, false)) {
        playerSpawn = player.position.copy().setY(player.position.y - 64);
    }

    const playerHouse = loadHouse(player);

    if(playerHouse) {
        player.metadata.customMap = {
            renderPosition: pohPosition,
            chunks: playerHouse.rooms
        } as ConstructedRegion;
    }

    player.teleport(playerSpawn);

    if(!player.metadata.customMap) {
        const house = new House();
        house.rooms[0][6][6] = new Room('garden');

        player.metadata.customMap = {
            renderPosition: pohPosition,
            chunks: house.rooms
        } as ConstructedRegion;
    } else {
        player.metadata.customMap.renderPosition = pohPosition;
    }

    const landscapeObject: LandscapeObject = {
        objectId: 13405,
        x: 6435,
        y: 6435, // center of house
        level: 0,
        type: 10,
        orientation: 1
    }

    player.instance.spawnGameObject(landscapeObject);

    for(let plane = 0; plane < 3; plane++) {
        for(let chunkX = 0; chunkX < 13; chunkX++) {
            for(let chunkY = 0; chunkY < 13; chunkY++) {
                const room = player.metadata.customMap.chunks[plane][chunkX][chunkY] as Room;
                if(!room) {
                    continue;
                }

                const templatePosition = room.templatePosition;

                // load all the PoH template maps into memory so that their collision maps are generated
                activeWorld.chunkManager.getChunk(templatePosition);

                // place furniture into room

                const roomConfig = ROOM_CONFIG[room.type];

                if (!roomConfig) {
                    logger.warn(`No room config for room type ${room.type}`);
                    continue;
                }

                if (room.type !== 'empty' && room.type !== 'empty_grass') {
                    for (const furniture of room.furniture) {
                        const furnitureConfig = roomConfig.furniture[furniture.key];

                        const cacheObject = findObject(furniture.replacementId);

                        if (!cacheObject) {
                            logger.warn(`No cacheObject for furniture replacementId ${furniture.replacementId}`);
                            continue;
                        }

                        const rotatedPosition = rotateChunkCoordinate(
                            { x: furnitureConfig.x, y: furnitureConfig.y },
                            room.orientation,
                            cacheObject.rendering.sizeX,
                            cacheObject.rendering.sizeY
                        );

                        const roomX = ((chunkX - 2) * 8) + 6400;
                        const roomY = ((chunkY - 2) * 8) + 6400;
                        const roomOrigin = new Position(roomX, roomY, plane);

                        // TODO find a neater way to do this
                        const furnitureOrientation = (furnitureConfig.orientation + room.orientation + 2) & 3;

                        const landscapeObject: LandscapeObject = {
                            type: furnitureConfig.objectType,
                            orientation: furnitureOrientation,

                            // none of these properties are used by the packet
                            // TODO improve the API of removeLoactionObject
                            objectId: furniture.replacementId,
                            x: roomOrigin.x + rotatedPosition.x,
                            y: roomOrigin.y + rotatedPosition.y,
                            level: plane,
                        }

                        player.instance.spawnGameObject(landscapeObject);
                    }
                }
            }
        }
    }
};


export class House {

    public rooms: Room[][][];
    // TODO add object

    public constructor() {
        this.rooms = new Array(4);
        for(let level = 0; level < 4; level++) {
            this.rooms[level] = new Array(MAP_SIZE);
            for(let x = 0; x < MAP_SIZE; x++) {
                this.rooms[level][x] = new Array(MAP_SIZE).fill(null);

                if(level === 0) {
                    for(let y = 0; y < MAP_SIZE; y++) {
                        this.rooms[level][x][y] = new Room('empty_grass');
                    }
                }
            }
        }
    }

    public copyRooms(rooms: Room[][][]): void {
        for(let level = 0; level < 4; level++) {
            for(let x = 0; x < MAP_SIZE; x++) {
                for(let y = 0; y < MAP_SIZE; y++) {
                    const existingRoom = rooms[level][x][y] ?? null;
                    this.rooms[level][x][y] = existingRoom ? new Room(existingRoom.type, existingRoom.orientation) : null;
                }
            }
        }
    }

}


export class Room extends ConstructedChunk {

    public readonly type: RoomType;

    public readonly furniture: Furniture[] = [];

    public constructor(type: RoomType, orientation: number = 0) {
        super(orientation);
        this.type = type;

        if (type === 'study') {
            this.furniture.push({ key: 'wall_space_1', replacementId: 13662 });
            this.furniture.push({ key: 'wall_space_2', replacementId: 13663 });
            this.furniture.push({ key: 'wall_space_3', replacementId: 13664 });
            this.furniture.push({ key: 'wall_space_4', replacementId: 13662 });

            this.furniture.push({ key: 'bookcase_1', replacementId: 13599 });
            this.furniture.push({ key: 'bookcase_2', replacementId: 13599 });

            this.furniture.push({ key: 'globe', replacementId: 13653 });
            this.furniture.push({ key: 'telescope', replacementId: 13656 });
            this.furniture.push({ key: 'crystal_ball', replacementId: 13661 });
            this.furniture.push({ key: 'lectern', replacementId: 13648 });
        }
    }

    public getTemplatePosition(): Position {
        return roomTemplates[this.type];
    }

}
