import { itemInteractionActionHandler } from '@engine/action';
import { findItem, findObject, widgets } from '@engine/config/config-handler';
import { BUILDABLE_FURNITURE } from '../data/furniture';
import { getBuildFurnitureFailureMessage } from '../util/requirements';
import { Position } from '@engine/world';
import { getCurrentRoom } from '../util';
import { Room } from '../models/room';
import { ROOM_CONFIG } from '../data';
import { clearPlayerBuildingPlaceholderKey, getPlayerBuildingPlaceholderKey } from '../player/metadata';
import { replaceRoomPlaceholder } from '../room/furniture-objects';
import { logger } from '@runejs/common';
import { rotateChunkCoordinate } from '../util/rotations';

/**
 * This is a handler for a player interacting with the interface item displayed
 * when building furniture.
 *
 * Note that they are interacting with an *item* here, not an object.
 *
 * @param player The player interacting with the item
 * @param item The item being interacted with
 *
 * @author sigex
 */
export const handler: itemInteractionActionHandler = ({ player, itemId }) => {
    const buildingFurniture = BUILDABLE_FURNITURE[itemId];

    const message = getBuildFurnitureFailureMessage(player, buildingFurniture)
    if(message) {
        player.sendMessage(message);
        return;
    }

    const currentRoom = getCurrentRoom(player);
    if(!currentRoom) {
        logger.warn(`Player ${player.username} tried to build furniture at ${player.position} but they are not in a room.`);
        return null;
    }

    const room = player.metadata.customMap.chunks[currentRoom.level][currentRoom.x][currentRoom.y] as Room

    const placeholderKey = getPlayerBuildingPlaceholderKey(player);
    clearPlayerBuildingPlaceholderKey(player);

    const placeholderFurniture = ROOM_CONFIG[room.type].furniture[placeholderKey];

    const cacheObject = findObject(placeholderFurniture.placeholderId);
    if (!cacheObject) {
        logger.error(`Could not find object with id ${placeholderFurniture.placeholderId} in cache when searching for placeholder.`);
        return null;
    }

    // the placeholders are stored in the room config as if the room were at orientation 0
    // so we need to rotate the placeholder coordinates to match the room's orientation
    const rotatedObjectPositionInChunk = rotateChunkCoordinate(
        {
            x: placeholderFurniture.x,
            y: placeholderFurniture.y,
        },
        // TODO figure out room rotations
        room.orientation,
        cacheObject.rendering.sizeX,
        cacheObject.rendering.sizeY
    );

    // TODO (jameskmonger / sigex) find a better solution!!
    const pohPosition = new Position(6400, 6400);

    // we also need to rotate all furniture objects so that they are facing the correct direction
    // as all the placeholders are stored at room orientation 0, we can just add them together
    const furnitureRotation = (placeholderFurniture.orientation + room.orientation) & 3;

    replaceRoomPlaceholder(
        player,
        pohPosition,
        buildingFurniture.objectId,
        {
            type: placeholderFurniture.objectType,
            orientation: furnitureRotation,
            objectId: placeholderFurniture.placeholderId,
            x: rotatedObjectPositionInChunk.x,
            y: rotatedObjectPositionInChunk.y,
            level: currentRoom.level,
        },
        currentRoom.x,
        currentRoom.y,
        currentRoom.level
    )
    player.interfaceState.closeAllSlots();
    // TODO switch to object names not item names (they are abbreviated)
    player.sendMessage(`You build a ${findItem(itemId).name}.`)
};

export default {
    pluginId: 'rs:build_furniture',
    hooks: [
        {
            type: 'item_interaction',
            widgets: widgets.poh.furnitureCreationMenu,
            options: 'build',
            handler,
            cancelOtherActions: false
        }
    ]
};
