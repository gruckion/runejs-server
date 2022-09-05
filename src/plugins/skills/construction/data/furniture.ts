import { BuildableFurnitureDefinition } from '../types';

// TODO use rs:item_name here

const PLANK = 960;
const OAK_PLANK = 8778;
const TEAK_PLANK = 8780;
const MAHOGANY_PLANK = 8782;
const NAILS = 4820;
const BOLT_OF_CLOTH = 8790;
const SOFT_CLAY = 1761;
const LIMESTONE_BRICK = 3420;
const MARBLE_BLOCK = 8786;

/**
 * This is an index of [item id] => [furniture definition]
 *
 * where `item id` is the id of the item rendered on the build interface
 */
export const BUILDABLE_FURNITURE: Record<number, BuildableFurnitureDefinition> = {
    // bookcase
    8319: {
        itemId: 8319,
        placeholderId: 15416,
        objectId: 13597,
        level: 4,
        experience: 115,
        requirements: [
            { itemId: PLANK, amount: 4 },
            { itemId: NAILS, amount: 4 },
        ]
    },
    8320: {
        itemId: 8320,
        objectId: 13598,
        placeholderId: 15416,
        level: 29,
        experience: 180,
        requirements: [
            { itemId: OAK_PLANK, amount: 3 },
        ]
    },
    8321: {
        itemId: 8321,
        objectId: 13599,
        placeholderId: 15416,
        level: 40,
        experience: 420,
        requirements: [
            { itemId: MAHOGANY_PLANK, amount: 3 },
        ]
    },
    // chair
    8496: {
        itemId: 8496,
        objectId: 13581,
        placeholderId: 15411,
        level: 1,
        experience: 58,
        requirements: [
            { itemId: PLANK, amount: 2 },
            { itemId: NAILS, amount: 2 }
        ]
    },
    8498: {
        itemId: 8498,
        objectId: 13582,
        placeholderId: 15411,
        level: 8,
        experience: 87,
        requirements: [
            { itemId: PLANK, amount: 3 },
            { itemId: NAILS, amount: 3 }
        ]
    },
    8500: {
        itemId: 8500,
        objectId: 13583,
        placeholderId: 15411,
        level: 14,
        experience: 87,
        requirements: [
            { itemId: PLANK, amount: 3 },
            { itemId: NAILS, amount: 3 }
        ]
    },
    8502: {
        itemId: 8502,
        objectId: 13584,
        placeholderId: 15410,
        level: 19,
        experience: 120,
        requirements: [
            { itemId: OAK_PLANK, amount: 2 }
        ]
    },
    8504: {
        itemId: 8504,
        objectId: 13585,
        placeholderId: 15410,
        level: 26,
        experience: 180,
        requirements: [
            { itemId: OAK_PLANK, amount: 3 }
        ]
    },
    8506: {
        itemId: 8506,
        objectId: 13586,
        placeholderId: 15410,
        level: 35,
        experience: 180,
        requirements: [
            { itemId: TEAK_PLANK, amount: 2 }
        ]
    },
    8508: {
        itemId: 8508,
        objectId: 13587,
        placeholderId: 15410,
        level: 50,
        experience: 280,
        requirements: [
            { itemId: MAHOGANY_PLANK, amount: 2 }
        ]
    },
    // curtains
    8322: {
        itemId: 8322,
        objectId: 13603,
        placeholderId: 15419,
        level: 2,
        experience: 132,
        requirements: [
            { itemId: 960, amount: 3 },
            { itemId: NAILS, amount: 3 },
            { itemId: BOLT_OF_CLOTH, amount: 3 },
        ]
    },
    8323: {
        itemId: 8323,
        objectId: 13604,
        placeholderId: 15419,
        level: 18,
        experience: 225,
        requirements: [
            { itemId: OAK_PLANK, amount: 3 },
            { itemId: BOLT_OF_CLOTH, amount: 3 },
        ]
    },
    8324: {
        itemId: 8324,
        objectId: 13605,
        placeholderId: 15419,
        level: 40,
        experience: 315,
        requirements: [
            { itemId: TEAK_PLANK, amount: 3 },
            { itemId: BOLT_OF_CLOTH, amount: 3 },
        ]
    },
    // fireplaces
    8325: {
        itemId: 8325,
        objectId: 13609,
        placeholderId: 15418,
        level: 3,
        requirements: [
            { itemId: SOFT_CLAY, amount: 3 }
        ]
    },
    8326: {
        itemId: 8326,
        objectId: 13611,
        placeholderId: 15418,
        level: 33,
        requirements: [
            { itemId: LIMESTONE_BRICK, amount: 2 }
        ]
    },
    8327: {
        itemId: 8327,
        objectId: 13613,
        placeholderId: 15418,
        level: 63,
        requirements: [
            { itemId: MARBLE_BLOCK, amount: 1 }
        ]
    }
};

const CHAIR_FURNITURE: BuildableFurnitureDefinition[] = [
    BUILDABLE_FURNITURE[8496],
    BUILDABLE_FURNITURE[8498],
    BUILDABLE_FURNITURE[8500],

    // TODO (Sigex) these are commented out until the interface supports > 3
    // BUILDABLE_FURNITURE[8502],
    // BUILDABLE_FURNITURE[8504],
    // BUILDABLE_FURNITURE[8506],
    // BUILDABLE_FURNITURE[8508],
].map((f, index) => {
    if (!f) {
        throw new Error(`Missing furniture definition ${index} for placeholder 15410`);
    }

    return f;
})

/**
 * This is an index of [object id] => [furniture definition]
 *
 * where `object id` is the id of the placeholder object
 */
export const FURNITURE_FOR_PLACEHOLDER: Record<number, BuildableFurnitureDefinition[]> = {
    15410: CHAIR_FURNITURE,
    15411: CHAIR_FURNITURE,
    15412: CHAIR_FURNITURE,
    15416: [
        BUILDABLE_FURNITURE[8319],
        BUILDABLE_FURNITURE[8320],
        BUILDABLE_FURNITURE[8321],
    ].map((f, index) => {
        if (!f) {
            throw new Error(`Missing furniture definition ${index} for placeholder 15416`);
        }

        return f;
    }),
    15418: [
        BUILDABLE_FURNITURE[8325],
        BUILDABLE_FURNITURE[8326],
        BUILDABLE_FURNITURE[8327]
    ].map((f, index) => {
        if (!f) {
            throw new Error(`Missing furniture definition ${index} for placeholder 15419`);
        }

        return f;
    }),
    15419: [
        BUILDABLE_FURNITURE[8322],
        BUILDABLE_FURNITURE[8323],
        BUILDABLE_FURNITURE[8324]
    ].map((f, index) => {
        if (!f) {
            throw new Error(`Missing furniture definition ${index} for placeholder 15419`);
        }

        return f;
    })
}
