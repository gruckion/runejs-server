import { RoomType } from '../con-constants';

type RoomObjectPlaceholder = {
    key: string;
    x: number;
    y: number;
    placeholderId: number;
    objectType: number;
    orientation: 0 | 1 | 2 | 3;
}

export const ROOM_CONFIG: Record<RoomType, { objects: RoomObjectPlaceholder[] }> = {
    'empty': { objects: [] },
    'empty_grass': { objects: [] },
    'garden': { objects: [] },
    'formal_garden': { objects: [] },
    'parlor': { objects: [] },
    'kitchen': { objects: [] },
    'dining_room': { objects: [] },
    'bedroom': { objects: [] },
    'skill_hall': { objects: [] },
    'quest_hall': { objects: [] },
    'portal_chamber': { objects: [] },
    'combat_room': { objects: [] },
    'games_room': { objects: [] },
    'treasure_room': { objects: [] },
    'chapel': { objects: [] },
    'study': {
        objects: [
            { key: 'wall_space_1', x: 0, y: 1, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
            { key: 'wall_space_2',  x: 1, y: 7, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
            { key: 'wall_space_3',  x: 6, y: 7, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space
            { key: 'wall_space_4',  x: 7, y: 1, placeholderId: 15423, objectType: 4, orientation: 0 }, // wall space

            { key: 'globe', x: 1, y: 4, placeholderId: 15421, objectType: 10, orientation: 0 }, // globe
            { key: 'bookcase_1', x: 3, y: 7, placeholderId: 15425, objectType: 10, orientation: 0 }, // bookcase
            { key: 'bookcase_2', x: 4, y: 7, placeholderId: 15425, objectType: 10, orientation: 0 }, // bookcase
            { key: 'telescope', x: 5, y: 7, placeholderId: 15424, objectType: 10, orientation: 0 }, // telescope
            { key: 'crystal_ball', x: 5, y: 2, placeholderId: 15422, objectType: 10, orientation: 0 }, // crystal ball
            { key: 'lectern', x: 2, y: 2, placeholderId: 15420, objectType: 10, orientation: 0 }, // lectern
        ]
    },
    'throne_room': { objects: [] },
    'workshop': { objects: [] },
    'oubliette': { objects: [] },
    'costume_room': { objects: [] },
}
