import { commandActionHandler } from '@engine/action';
import { findObject } from '@engine/config';
import { Position } from '@engine/world';
import { RoomType } from '@plugins/skills/construction/con-constants';
import { ROOM_CONFIG } from '@plugins/skills/construction/data';
import { Room } from '@plugins/skills/construction/house';
import { getCurrentRoom } from '@plugins/skills/construction/util';
import { rotateChunkCoordinate } from '@plugins/skills/construction/util/rotations';
import { LandscapeObject } from '@runejs/filestore';



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
