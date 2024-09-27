import { findObject } from '@engine/config';
import { logger } from '@runejs/common';
import { ROOM_CONFIG } from '../data';
import { Room } from '../models/room'
import { rotateChunkCoordinate } from '../util/rotations';

/**
 * Find a furniture placeholder in a room by a given object id and location.
 *
 * The position of the object is relative to the chunk it is in, and the room's
 * current orientation will be taken into account when looking for a matching placeholder.
 *
 * @param room The room to search for the placeholder in.
 * @param objectId The object id of the placeholder to find.
 * @param position The local chunk coordinates (0-7,0-7) of the placeholder
 *
 * @author jameskmonger
 */
export function findPlaceholderObjectInRoom(room: Room, objectId: number, position: { x: number, y: number }) {
    const cacheObject = findObject(objectId);
    if (!cacheObject) {
        logger.error(`Could not find object with id ${objectId} in cache when searching for placeholder.`);
        return null;
    }

    const rotatedObjectPositionInChunk = rotateChunkCoordinate(
        position,
        // TODO (jameskmonger) should we be doing this orientation flipping?
        room.orientation === 1 ? 3 : room.orientation === 3 ? 1 : room.orientation,
        cacheObject.rendering.sizeX,
        cacheObject.rendering.sizeY
    );

    const roomPlaceholders = ROOM_CONFIG[room.type];

    // TODO exit out if no room || no placeholders

    const placeholder = Object.entries(roomPlaceholders.furniture).find(([ placeholderKey, buildablePlaceholder ]) => {
        return (
            buildablePlaceholder.x === rotatedObjectPositionInChunk.x
            && buildablePlaceholder.y === rotatedObjectPositionInChunk.y
            && buildablePlaceholder.placeholderId === objectId
        );
    });

    if (!placeholder) {
        console.log(roomPlaceholders.furniture);
        console.log(`Could not find placeholder object with id ${objectId} in room ${room.type} at position ${rotatedObjectPositionInChunk.x},${rotatedObjectPositionInChunk.y}, (${position.x}, ${position.y}) orientation ${room.orientation}`);
        return null;
    }

    return placeholder;
}
