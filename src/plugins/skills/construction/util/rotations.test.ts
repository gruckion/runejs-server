//            0     1     2     3     4     5     6     7
//
//
//     7                       B1
//
//     6           A0                            A1
//
//     5
//
//     4                                             B2
//
//     3     B0
//
//     2
//
//     1          A3                             A2
//
//     0                             B3

import { rotateChunkCoordinate } from './rotations';


const A0 = [1, 6];
const A1 = [6, 6];
const A2 = [6, 1];
const A3 = [1, 1];
const B0 = [0, 3];
const B1 = [3, 7];
const B2 = [7, 4];
const B3 = [4, 0];

describe('rotateChunkCoordinate', () => {
    describe('when orientation is 0', () => {
        const orientation = 0;

        it.each([
            A0, A2, B0, B2,
        ])('should return the same coordinates (%d, %d)', (x: number, y: number) => {
            expect(rotateChunkCoordinate({ x, y }, orientation)).toEqual({ x, y });
        });
    });

    describe('when orientation is 1', () => {
        const orientation = 1;

        it.each([
            [...A0, ...A1],
            [...A1, ...A2],
            [...A2, ...A3],
            [...A3, ...A0],

            [...B0, ...B1],
            [...B1, ...B2],
            [...B2, ...B3],
            [...B3, ...B0],
        ])('should return the rotated coordinates (%d, %d) -> (%d, %d)', (x: number, y: number, expectedX: number, expectedY: number) => {
            expect(rotateChunkCoordinate({ x, y }, orientation)).toEqual({ x: expectedX, y: expectedY });
        });
    });

    describe('when orientation is 2', () => {
        const orientation = 2;

        it.each([
            [...A0, ...A2],
            [...A1, ...A3],
            [...A2, ...A0],
            [...A3, ...A1],

            [...B0, ...B2],
            [...B1, ...B3],
            [...B2, ...B0],
            [...B3, ...B1],
        ])('should return the rotated coordinates (%d, %d) -> (%d, %d)', (x: number, y: number, expectedX: number, expectedY: number) => {
            expect(rotateChunkCoordinate({ x, y }, orientation)).toEqual({ x: expectedX, y: expectedY });
        });
    });

    describe('when orientation is 3', () => {
        const orientation = 3;

        // A0 -> A3: (1, 6) -> (1, 6)
        // A1 -> A0: (6, 1) -> (1, 6)
        // A2 -> A1: (6, 6) -> (6, 1)
        // A3 -> A2: (1, 6) -> (6, 6)


        // B0 -> B3: (0, 3) -> (4, 7)
        // B1 -> B0: (3, 0) -> (0, 3)
        // B2 -> B1: (7, 3) -> (3, 0)
        // B3 -> B2: (4, 7) -> (7, 3)

        it.each([
            [...A0, ...A3],
            [...A1, ...A0],
            [...A2, ...A1],
            [...A3, ...A2],

            [...B0, ...B3],
            [...B1, ...B0],
            [...B2, ...B1],
            [...B3, ...B2],
        ])('should return the rotated coordinates (%d, %d) -> (%d, %d)', (x: number, y: number, expectedX: number, expectedY: number) => {
            expect(rotateChunkCoordinate({ x, y }, orientation)).toEqual({ x: expectedX, y: expectedY });
        });
    });
})
