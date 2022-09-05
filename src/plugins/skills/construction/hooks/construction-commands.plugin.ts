import { commandActionHandler, PlayerCommandAction } from '@engine/action';
import { openHouseWithWelcome } from '../house';
import { saveHouse } from '../home-saver';
import { findObject } from '@engine/config';
import { ConstructedRegion, Position, activeWorld} from '@engine/world';
import { LandscapeObject } from '@runejs/filestore';
import { MAP_SIZE, RoomType, roomTemplates } from '../con-constants';
import { ROOM_CONFIG } from '../data';
import { getCurrentRoom } from '../util';
import { rotateChunkCoordinate } from '../util/rotations';
import { logger } from '@runejs/common';
import { Room } from '../models/room';

const noBuildModeAction: commandActionHandler = ({ player, args }) => {
    const customMap: ConstructedRegion = player.metadata?.customMap;

    if(!customMap) {
        player.sendMessage('[temp] you must be in a POH to run this command');
        return;
    }

    const plane = 0;
    for(let chunkX = 0; chunkX < 13; chunkX++) {
        for(let chunkY = 0; chunkY < 13; chunkY++) {
            const room = customMap.chunks[plane][chunkX][chunkY] as Room;
            if(!room) {
                continue;
            }

            // no need to worry about build mode for empty tiles
            if (room.type === 'empty' || room.type === 'empty_grass') {
                continue;
            }

            const roomConfig = ROOM_CONFIG[room.type];

            if (!roomConfig) {
                logger.warn(`No room config for room type ${args.room}`);
                continue;
            }

            // calculate the origin coordinates of the room in the game world
            // why do we need to (- 2) here?
            const roomX = ((chunkX - 2) * 8) + 6400;
            const roomY = ((chunkY - 2) * 8) + 6400;
            const roomOrigin = new Position(roomX, roomY, plane);

            for (const roomObj of Object.values(roomConfig.furniture)) {
                const landscapeObject: LandscapeObject = {
                    type: roomObj.objectType,
                    orientation: roomObj.orientation,

                    // none of these properties are used by the packet
                    // TODO improve the API of removeLoactionObject
                    objectId: 0,
                    x: 0,
                    y: 0,
                    level: 0,
                }

                const cacheObject = findObject(roomObj.placeholderId);

                player.sendMessage(`[temp] removing ${cacheObject?.name} (${roomObj.placeholderId}) [size: ${cacheObject?.rendering.sizeX},${cacheObject?.rendering.sizeX}]`);

                const rotatedPosition = rotateChunkCoordinate(
                    { x: roomObj.x, y: roomObj.y },
                    room.orientation,
                    cacheObject.rendering.sizeX,
                    cacheObject.rendering.sizeY
                );

                console.log(`room orientation is ${room.orientation}`);
                console.log(`roomObj position: ${roomObj.x}, ${roomObj.y}`);
                console.log(`rotated position: ${rotatedPosition.x}, ${rotatedPosition.y}`);

                player.outgoingPackets.removeLocationObject(landscapeObject, roomOrigin.add(rotatedPosition.x, rotatedPosition.y));
            }
        }
    }
};


export default {
    pluginId: 'rs:construction_commands',
    hooks: [
        {
            type: 'player_command',
            commands: [ 'con', 'poh', 'house' ],
            handler: ({ player }: PlayerCommandAction): void => openHouseWithWelcome(player)
        },
        {
            type: 'player_command',
            commands: [ 'savepoh', 'savehouse' ],
            handler: ({ player }: PlayerCommandAction): void => {
                player.sendMessage(`Saving house data...`);
                saveHouse(player);
            }
        },
        {
            type: 'player_command',
            commands: [ 'nobuild' ],
            handler: noBuildModeAction
        },
        {
            type: 'player_command',
            commands: [ 'dumpfurn' ],
            handler: ({ player }: PlayerCommandAction): void => {
                const roomCoords = getCurrentRoom(player);

                if (!roomCoords) {
                    player.sendMessage('You must be in a room to run this command');
                    return;
                }

                const room = player.metadata.customMap.chunks[roomCoords.level][roomCoords.x][roomCoords.y] as Room;

                const template = roomTemplates[room.type];

                player.sendMessage(`[temp] room type: ${room.type}`);

                // any objects that say `null`, walls, etc
                const BAD_OBJECT_IDS = [
                    13098, 13830, 15313, 15314
                ];

                player.sendMessage(`[temp] template ${template.x}, ${template.y}, ${0}`);

                const out: Record<string, { placeholderId: number, x: number, y: number, orientation: number, objectType: number }> = {};

                // for (const objectId of OBJECT_IDS) {
                for (let objectId = 3000; objectId < 20000; objectId++) {
                    if (BAD_OBJECT_IDS.includes(objectId)) {
                        continue;
                    }

                    for (let x = 0; x <= 7; x++) {
                        for (let y = 0; y <= 7; y++) {
                            const worldX = template.x + x;
                            const worldY = template.y + y;

                            const objectPosition = new Position(worldX, worldY, 0);

                            const objectChunk = activeWorld.chunkManager.getChunkForWorldPosition(objectPosition);
                            const filestoreObject = objectChunk.getFilestoreLandscapeObject(objectId, objectPosition);

                            if (filestoreObject) {
                                const config = findObject(objectId);
                                player.sendMessage('go and read the console! there is nothing for you here! hee hee')

                                if (config.name === 'null' || !config.name) {
                                    continue;
                                }

                                out[`${config.name}_${x}_${y}`.toLowerCase().replace(/ /g, '_')] = ({
                                    placeholderId: objectId,
                                    x,
                                    y,
                                    orientation: filestoreObject.orientation,
                                    objectType: filestoreObject.type
                                })
                            }
                        }
                    }
                }

                console.log(JSON.stringify(out, null, 4));

                player.sendMessage(`done! hee hee!`)
            }
        }
    ]
};
