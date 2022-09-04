import {
    objectInteractionActionHandler
} from '@engine/action/pipe/object-interaction.action';
import { openHouse, Room } from '@plugins/skills/construction/house';
import { MAP_SIZE, roomBuilderButtonMap } from '@plugins/skills/construction/con-constants';
import { buttonActionHandler } from '@engine/action/pipe/button.action';
import { getCurrentRoom } from '@plugins/skills/construction/util';
import { Player } from '@engine/world/actor/player/player';
import { Coords } from '@engine/world/position';
import { dialogue, execute, goto } from '@engine/world/actor/dialogue';
import { saveHouse } from './home-saver';
import { widgets } from '@engine/config';


const newRoomOriention = (player: Player): number => {
    const currentRoom = getCurrentRoom(player);

    if(!currentRoom) {
        return 0;
    }

    const playerLocalX = player.position.localX;
    const playerLocalY = player.position.localY;

    let deltaX = 0;
    let deltaY = 0;

    let orientation = 0;

    if(playerLocalX === 7) {
        // build east
        deltaX = 1;
        orientation = 1;
    } else if(playerLocalX === 0) {
        // build west
        deltaX = -1;
        orientation = 3;
    } else if(playerLocalY === 7) {
        // build north
        deltaY = 1;
        orientation = 0;
    } else if(playerLocalY === 0) {
        // build south
        deltaY = -1;
        orientation = 2;
    }

    return orientation;
};


const getFacingRoom = (player: Player): { coords: Coords, roomExists: boolean } | null => {
    const currentRoom = getCurrentRoom(player);

    if(!currentRoom) {
        return null;
    }

    const playerLocalX = player.position.localX;
    const playerLocalY = player.position.localY;

    let buildX = currentRoom.x;
    let buildY = currentRoom.y;

    if(playerLocalX === 7) {
        // build east
        if(currentRoom.x < MAP_SIZE - 3) {
            buildX = currentRoom.x + 1;
        }
    } else if(playerLocalX === 0) {
        // build west
        if(currentRoom.x > 2) {
            buildX = currentRoom.x - 1;
        }
    } else if(playerLocalY === 7) {
        // build north
        if(currentRoom.y < MAP_SIZE - 3) {
            buildY = currentRoom.y + 1;
        }
    } else if(playerLocalY === 0) {
        // build south
        if(currentRoom.y > 2) {
            buildY = currentRoom.y - 1;
        }
    }

    if(buildX === currentRoom.x && buildY === currentRoom.y) {
        player.sendMessage(`You can not build there.`);
        return null;
    }

    const rooms = player.metadata.customMap.chunks as Room[][][];
    const existingRoom = rooms[player.position.level][buildX][buildY];

    if(existingRoom && existingRoom.type !== 'empty_grass' && existingRoom.type !== 'empty') {
        return {
            coords: {
                x: buildX,
                y: buildY,
                level: player.position.level
            },
            roomExists: true
        };
    }

    return {
        coords: {
            x: buildX,
            y: buildY,
            level: player.position.level
        },
        roomExists: false
    };
};


export const roomBuilderWidgetHandler: buttonActionHandler = async ({ player, buttonId }) => {
    const facingRoom = getFacingRoom(player);
    if(!facingRoom || facingRoom.roomExists) {
        return;
    }
    const { coords: newRoomCoords } = facingRoom;

    const chosenRoomType = roomBuilderButtonMap[buttonId];
    if(!chosenRoomType) {
        return;
    }

    const newRoom = new Room(chosenRoomType, newRoomOriention(player));
    player.metadata.customMap.chunks[newRoomCoords.level][newRoomCoords.x][newRoomCoords.y] = newRoom;
    player.updateFlags.mapRegionUpdateRequired = true;


    console.log(`orientation: ${newRoom.orientation}`);

    player.interfaceState.closeAllSlots();

    saveHouse(player);
    openHouse(player);

    await dialogue([ player ], [
        (options, tag_Home) => [
            'Rotate Counter-Clockwise', [
                execute(() => {
                    const room = player.metadata.customMap.chunks[newRoomCoords.level][newRoomCoords.x][newRoomCoords.y]
                    room.orientation = room.orientation > 0 ? room.orientation - 1 : 3;
                    console.log(`orientation: ${room.orientation}`);
                    saveHouse(player);
                    openHouse(player);
                }),
                goto('tag_Home')
            ],
            'Rotate Clockwise', [
                execute(() => {
                    const room = player.metadata.customMap.chunks[newRoomCoords.level][newRoomCoords.x][newRoomCoords.y]
                    room.orientation = room.orientation < 3 ? room.orientation + 1 : 0;
                    console.log(`orientation: ${room.orientation}`);
                    saveHouse(player);
                    openHouse(player);
                }),
                goto('tag_Home')
            ],
            'Build', [
                execute(() => { saveHouse(player); })
            ],
            'Cancel', [
                execute(() => {})
            ]
        ]
    ]);
};


export const doorHotspotHandler: objectInteractionActionHandler = ({ player }) => {
    const facingRoom = getFacingRoom(player);
    if(!facingRoom) {
        return;
    }

    if(facingRoom.roomExists) {
        return;
    } else {
        player.interfaceState.openWidget(widgets.poh.roomCreationMenu, { slot: 'screen' });
    }

};
