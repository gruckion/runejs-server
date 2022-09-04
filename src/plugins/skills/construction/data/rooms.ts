import { RoomType } from '../con-constants';

type RoomObjectPlaceholder = {
    x: number;
    y: number;
    placeholderId: number;
    objectType: number;
    orientation: 0 | 1 | 2 | 3;
}

export const ROOM_CONFIG: Record<RoomType, { furniture: Record<string, RoomObjectPlaceholder> }> = {
    'empty': { furniture: {} },
    'empty_grass': { furniture: {} },
    'garden': { furniture: {} },
    'formal_garden': { furniture: {} },
    'parlor': { furniture: {} },
    'kitchen': { furniture: {} },
    'dining_room': { furniture: {} },
    'bedroom': { furniture: {} },
    'skill_hall': { furniture: {} },
    'quest_hall': { furniture: {} },
    'portal_chamber': { furniture: {} },
    'combat_room': { furniture: {} },
    'games_room': { furniture: {} },
    'treasure_room': { furniture: {} },
    'chapel': { furniture: {} },
    'study': {
        furniture: {
            'wall_space_1': {
                x: 0, y: 1, placeholderId: 15423, objectType: 4, orientation: 0
            },
            'wall_space_2': {
                x: 1, y: 7, placeholderId: 15423, objectType: 4, orientation: 0
            },
            'wall_space_3': {
                x: 6, y: 7, placeholderId: 15423, objectType: 4, orientation: 0
            },
            'wall_space_4': {
                x: 7, y: 1, placeholderId: 15423, objectType: 4, orientation: 0
            },
            'globe': {
                x: 1, y: 4, placeholderId: 15421, objectType: 10, orientation: 0
            },
            'bookcase_1': {
                x: 3, y: 7, placeholderId: 15425, objectType: 10, orientation: 0
            },
            'bookcase_2': {
                x: 4, y: 7, placeholderId: 15425, objectType: 10, orientation: 0,
            },
            'telescope' : {
                x: 5, y: 7, placeholderId: 15424, objectType: 10, orientation: 0
            },
            'crystal_ball': {
                x: 5, y: 2, placeholderId: 15422, objectType: 10, orientation: 0
            },
            'lectern': {
                x: 2, y: 2, placeholderId: 15420, objectType: 10, orientation: 0
            }
        }


        // objects: [
        //     { key: 'wall_space_1', x: 0, y: 1, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
        //     { key: 'wall_space_2',  x: 1, y: 7, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
        //     { key: 'wall_space_3',  x: 6, y: 7, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
        //     { key: 'wall_space_4',  x: 7, y: 1, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space

        //     { key: 'globe', x: 1, y: 4, placeholderId: 15421, objectType: 10, orientation: 0 }, // globe
        //     { key: 'bookcase_1', x: 3, y: 7, placeholderId: 15425, objectType: 10, orientation: 0 }, // bookcase
        //     { key: 'bookcase_2', x: 4, y: 7, placeholderId: 15425, objectType: 10, orientation: 0 }, // bookcase
        //     { key: 'telescope', x: 5, y: 7, placeholderId: 15424, objectType: 10, orientation: 0 }, // telescope
        //     { key: 'crystal_ball', x: 5, y: 2, placeholderId: 15422, objectType: 10, orientation: 0 }, // crystal ball
        //     { key: 'lectern', x: 2, y: 2, placeholderId: 15420, objectType: 10, orientation: 0 }, // lectern
        // ]
    },
    'throne_room': { furniture: {} },
    'workshop': { furniture: {} },
    'oubliette': { furniture: {} },
    'costume_room': { furniture: {} },
}
