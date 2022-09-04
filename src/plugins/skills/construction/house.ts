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
import { House } from './models/house'
import { Room } from './models/room'
import { LandscapeObject } from '@runejs/filestore';
import { ROOM_CONFIG } from './data';
import { logger } from '@runejs/common';
import { rotateChunkCoordinate } from './util/rotations';
import { replaceFurnitureInHouse, replaceRoomPlaceholder } from './room/furniture-objects';

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

    const PLACEHOLDER_PORTAL_ID = 15361;
    const REAL_PORTAL_ID = 13405;
    const portalPlaceholder: LandscapeObject = {
        objectId: PLACEHOLDER_PORTAL_ID,
        x: 3,
        y: 3, // center of house
        level: 0,
        type: 10,
        orientation: 1
    }

    replaceRoomPlaceholder(player, pohPosition, REAL_PORTAL_ID, portalPlaceholder, 6, 6, 0);

    if (!inBuildMode) {
        replaceFurnitureInHouse(player, pohPosition);
    }
};
