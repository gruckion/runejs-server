import { Furniture } from '../types';

// TODO use rs:item_name here

export const BUILDABLE_FURNITURE: Record<number, Furniture> = {
    // fireplaces
    8325: {
        itemId: 8325,
        level: 3,
        requirements: [
            { itemId: 1761, amount: 3 }
        ]
    },
    8326: {
        itemId: 8326,
        level: 33,
        requirements: [
            { itemId: 3420, amount: 2 }
        ]
    },
    8327: {
        itemId: 8327,
        level: 63,
        requirements: [
            { itemId: 8786, amount: 1 }
        ]
    }
};

export const FURNITURE_FOR_PLACEHOLDER: Record<number, Furniture[]> = {
    15418: [
        BUILDABLE_FURNITURE[8325],
        BUILDABLE_FURNITURE[8326],
        BUILDABLE_FURNITURE[8327]
    ]
}
