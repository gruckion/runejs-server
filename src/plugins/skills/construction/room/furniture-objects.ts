import { findObject } from '@engine/config';
import { activeWorld } from '@engine/world';
import { Player } from '@engine/world/actor/player/player';
import { Position } from '@engine/world/position';
import { logger } from '@runejs/common';
import { LandscapeObject } from '@runejs/filestore';
import { ROOM_CONFIG } from '../data';
import { Room } from '../models/room';
import { rotateChunkCoordinate } from '../util/rotations';

/**
* Spawns an object in a room.
*
* TODO should Room be made aware of its local (chunk) position? This would allow us to remove the chunkX/Y/Plane params
*
* @author jameskmonger
*/
export function replaceRoomPlaceholder(player: Player, pohPosition: Position, replacementId: number, placeholderObject: LandscapeObject, chunkX: number, chunkY: number, plane: number) {
    const roomX = ((chunkX - 2) * 8) + pohPosition.x;
    const roomY = ((chunkY - 2) * 8) + pohPosition.y;
    const roomOrigin = new Position(roomX, roomY, plane);

    const adjustedPlaceholder = {
        ...placeholderObject,
        x: placeholderObject.x + roomOrigin.x,
        y: placeholderObject.y + roomOrigin.y,
    }

    console.log(`Replacing placeholder ${placeholderObject.objectId} with ${replacementId} at ${adjustedPlaceholder.x}, ${adjustedPlaceholder.y}`);
    console.log(`Room origin: ${roomOrigin.x}, ${roomOrigin.y}, placeholder object: ${placeholderObject.x}, ${placeholderObject.y}`);

    player.instance.replaceGameObject(replacementId, adjustedPlaceholder);
}

/**
 * Iterate through the chunks (rooms) in the house and replace the furniture with the correct objects.
 *
 * @author jameskmonger
 */
export function replaceFurnitureInHouse(player: Player, pohPosition: Position) {
    for(let plane = 0; plane < 3; plane++) {
        for(let chunkX = 0; chunkX < 13; chunkX++) {
            for(let chunkY = 0; chunkY < 13; chunkY++) {
                const room = player.metadata.customMap.chunks[plane][chunkX][chunkY] as Room;
                if(!room) {
                    continue;
                }

                replaceFurnitureInRoom(player, pohPosition, room, chunkX, chunkY, plane);
            }
        }
    }
}

/**
 * Replaces the furniture (placeholders) in a room with the room's furniture.
 *
 * TODO should Room be made aware of its local (chunk) position? This would allow us to remove the chunkX/Y/Plane params
 *
 * @author jameskmonger
 */
function replaceFurnitureInRoom(player: Player, pohPosition: Position, room: Room, chunkX: number, chunkY: number, plane: number) {
    const templatePosition = room.templatePosition;

    // load all the PoH template maps into memory so that their collision maps are generated
    activeWorld.chunkManager.getChunk(templatePosition);

    // place furniture into room

    const roomConfig = ROOM_CONFIG[room.type];

    if (!roomConfig) {
        logger.warn(`No room config for room type ${room.type}`);
        return;
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

            // TODO find a neater way to do this
            const furnitureOrientation = (furnitureConfig.orientation + room.orientation) & 3;

            replaceRoomPlaceholder(
                player,
                pohPosition,
                furniture.replacementId,
                {
                    type: furnitureConfig.objectType,
                    orientation: furnitureOrientation,

                    // none of these properties are used by the packet
                    // TODO improve the API of removeLoactionObject
                    objectId: furnitureConfig.placeholderId,
                    x: rotatedPosition.x,
                    y: rotatedPosition.y,
                    level: plane,
                },
                chunkX,
                chunkY,
                plane
            )
        }
    }
}
