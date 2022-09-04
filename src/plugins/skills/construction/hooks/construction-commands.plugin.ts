import { commandActionHandler, PlayerCommandAction } from '@engine/action';
import { openHouseWithWelcome, Room } from '../house';
import { saveHouse } from '../home-saver';
import { findObject } from '@engine/config';
import { ConstructedRegion, Position } from '@engine/world';
import { LandscapeObject } from '@runejs/filestore';
import { MAP_SIZE, RoomType } from '../con-constants';
import { ROOM_CONFIG } from '../data';
import { getCurrentRoom } from '../util';
import { rotateChunkCoordinate } from '../util/rotations';
import { logger } from '@runejs/common';

// obj ids
// 13098 is light wood wall
// 13099 is light wood window


// 13103 is light wood door
// 13106 is ???
// 13109 is dark wood door
// 13110 is dark wood door
// 13111 is dark wood wall
// 13112 is dark wood window
// 13113 is ???
// 13114 is ???
// 13115 is ???
// 13116 is white wall
// 13117 is white window

const noBuildModeAction: commandActionHandler = ({ player, args }) => {
    const customMap: ConstructedRegion = player.metadata?.customMap;

    if(!customMap) {
        player.sendMessage('[temp] you must be in a POH to run this command');
        return;
    }

    let plane = 0;

    // for(let plane = 0; plane < 3; plane++) {
        for(let chunkX = 0; chunkX < 13; chunkX++) {
            for(let chunkY = 0; chunkY < 13; chunkY++) {
                const room = customMap.chunks[plane][chunkX][chunkY];
                if(!room) {
                    player.sendMessage("wazzaaaaaa")

                    continue;
                }

                const templatePosition = room.templatePosition;


                player.sendMessage("wooo" + room.templatePosition.x + " " + room.templatePosition.y + " " + room.templatePosition.level)
            }
        }
    // }

    // const level = 0;

    // // TODO starting at 2 for safety reasons due to the -2 used when calculating the position
    // for(let x = 2; x < MAP_SIZE; x++) {
    //     for(let y = 2; y < MAP_SIZE; y++) {
    //         if (!customMap.chunks[x]) {
    //             player.sendMessage(`[temp] no chunk at x: ${x}`);
    //             continue;
    //         }

    //         if (!customMap.chunks[x][y]) {
    //             player.sendMessage(`[temp] no chunk at y: ${y}`);
    //             continue;
    //         }

    //         if (!customMap.chunks[x][y][level]) {
    //             player.sendMessage(`[temp] no chunk at level: ${level}`);
    //             continue;
    //         }

    //         const room = customMap.chunks[x][y][level] as Room;

    //         if (!room) {
    //             logger.warn(`No room at ${x}, ${y}, ${level}`);
    //             continue;
    //         }

    //         const roomConfig = ROOM_CONFIG[args.room as RoomType];

    //         if (!roomConfig) {
    //             logger.warn(`No room config for room type ${args.room}`);
    //             continue;
    //         }

    //         // calculate the origin coordinates of the room in the game world
    //         // why do we need to (- 2) here?
    //         const roomX = ((x - 2) * 8) + 6400;
    //         const roomY = ((y - 2) * 8) + 6400;
    //         const roomOrigin = new Position(roomX, roomY, level);

    //         player.sendMessage(`[temp] running nobuild for room ${args} (${x}, ${y}, ${level}) (${roomX}, ${roomY})`);

    //         for (const roomObj of roomConfig.objects) {
    //             const landscapeObject: LandscapeObject = {
    //                 type: roomObj.objectType,
    //                 orientation: roomObj.orientation,

    //                 // none of these properties are used by the packet
    //                 // TODO improve the API of removeLoactionObject
    //                 objectId: 0,
    //                 x: 0,
    //                 y: 0,
    //                 level: 0,
    //             }

    //             const cacheObject = findObject(roomObj.placeholderId);

    //             player.sendMessage(`[temp] removing ${cacheObject?.name} (${roomObj.placeholderId}) [size: ${cacheObject?.rendering.sizeX},${cacheObject?.rendering.sizeX}]`);

    //             const rotatedPosition = rotateChunkCoordinate(
    //                 { x: roomObj.x, y: roomObj.y },
    //                 room.orientation,
    //                 cacheObject.rendering.sizeX,
    //                 cacheObject.rendering.sizeY
    //             );

    //             console.log(`room orientation is ${room.orientation}`);
    //             console.log(`roomObj position: ${roomObj.x}, ${roomObj.y}`);
    //             console.log(`rotated position: ${rotatedPosition.x}, ${rotatedPosition.y}`);

    //             player.outgoingPackets.removeLocationObject(landscapeObject, roomOrigin.add(rotatedPosition.x, rotatedPosition.y));
    //         }
    //     }
    // }
};


export default {
    pluginId: 'rs:construction',
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
    ]
};
