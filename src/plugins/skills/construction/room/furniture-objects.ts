import { Player } from '@engine/world/actor/player/player';
import { Position } from '@engine/world/position';
import { LandscapeObject } from '@runejs/filestore';

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
