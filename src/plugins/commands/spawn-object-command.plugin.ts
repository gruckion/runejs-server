import { commandActionHandler } from '@engine/action';
import { LandscapeObject } from '@runejs/filestore';

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

type RoomType = 'study';

type RoomObject = {
    key: string;
    placeholderId: number;
    x: number;
    y: number;
    orientation: number;
    objectType: number;
}

const study = {
    objects: [
        { key: 'wall_space_1', x: 0, y: 1, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
        { key: 'wall_space_2',  x: 0, y: 6, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
        { key: 'wall_space_3',  x: 6, y: 7, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
        { key: 'wall_space_4',  x: 6, y: 0, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space

        { key: 'globe', x: 1, y: 1, placeholderId: 15421, objectType: 10, orientation: 0 }, // globe
        { key: 'bookcase_1', x: 0, y: 3, placeholderId: 15425, objectType: 10, orientation: 0 }, // bookcase
        { key: 'bookcase_2', x: 0, y: 4, placeholderId: 15425, objectType: 10, orientation: 0 }, // bookcase
        { key: 'telescope', x: 0, y: 5, placeholderId: 15424, objectType: 10, orientation: 0 }, // telescope
        { key: 'crystal_ball', x: 5, y: 5, placeholderId: 15422, objectType: 10, orientation: 0 }, // crystal ball
        { key: 'lectern', x: 5, y: 2, placeholderId: 15420, objectType: 10, orientation: 0 }, // lectern
    ]
}

const stephensStudy = {
    'bookcase_1': '13100',
    'bookcase_2': '13100',
}

const noBuildModeAction: commandActionHandler = ({ player, args }) => {
    const room = study;//roomObjects[args.room as RoomType];

    for (const roomObj of room.objects) {
        const landscapeObject: LandscapeObject = {
            objectId: roomObj.placeholderId,
            x: player.position.x + roomObj.x,
            y: player.position.y + roomObj.y,
            level: player.position.level,
            type: roomObj.objectType,
            orientation: roomObj.orientation
        }

        player.outgoingPackets.removeLocationObject(landscapeObject, player.position.add(roomObj.x, roomObj.y));
    }
};

const spawnObjectAction: commandActionHandler = ({ player, args }) => {
    const landscapeObject: LandscapeObject = {
        objectId: args.objectId as number,
        x: player.position.x,
        y: player.position.y,
        level: player.position.level,
        type: args.type as number,
        orientation: args.orientation as number
    }

    // player.instance.spawnGameObject(landscapeObject);
    player.outgoingPackets.setLocationObject(landscapeObject, player.position, args.offset as number);

    // player.outgoingPackets.setLocationObject(args.objectIds as number, args.prevSongId as number);
};

const despawnObjectAction: commandActionHandler = ({ player, args }) => {
    const landscapeObject: LandscapeObject = {
        objectId: args.objectId as number,
        x: player.position.x,
        y: player.position.y,
        level: player.position.level,
        type: args.type as number,
        orientation: args.objectIds as number
    }

    player.outgoingPackets.removeLocationObject(landscapeObject, player.position, args.offset as number);

    // player.outgoingPackets.setLocationObject(args.objectIds as number, args.prevSongId as number);
};

export default {
    pluginId: 'rs:spawn_object_command',
    hooks: [
        {
            type: 'player_command',
            commands: [ 'nobuild' ],
            handler: noBuildModeAction
        },
        {
            type: 'player_command',
            commands: [ 'wall' ],
            args: [{
                name: 'objectId',
                type: 'number'
            },{
                name: 'orientation',
                type: 'number',
                defaultValue: 0
            },{
                name: 'type',
                type: 'number',
                defaultValue: 0
            }],
            handler: spawnObjectAction
        },
        {
            type: 'player_command',
            commands: [ 'obj' ],
            args: [{
                name: 'objectId',
                type: 'number'
            },{
                name: 'orientation',
                type: 'number',
                defaultValue: 0
            },{
                name: 'type',
                type: 'number',
                defaultValue: 10
            }],
            handler: spawnObjectAction
        },
        {
            type: 'player_command',
            commands: [ 'objde' ],
            args: [{
                name: 'objectId',
                type: 'number'
            },{
                name: 'orientation',
                type: 'number',
                defaultValue: 0
            },
            {
                name: 'offset',
                type: 'number',
                defaultValue: 0
            },
            {
                name: 'type',
                type: 'number',
                defaultValue: 10
            }],
            handler: despawnObjectAction
        }
    ]
};

// https://www.rune-server.ee/runescape-development/rs2-server/configuration/20312-all-construction-object-ids-examine-info.html
