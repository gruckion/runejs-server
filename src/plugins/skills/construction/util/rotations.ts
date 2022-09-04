import { getTemplateLocalX, getTemplateLocalY } from '@engine/world/map/region';

type ChunkCoordinate = {
    x: number; // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    y: number; // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function rotateChunkCoordinate({ x, y }: ChunkCoordinate, orientation: number, sizeX = 1, sizeY = 1) {
    // for some reason the base function seems to have orientation 1 and 3 swapped
    // either its wrong there or here, but this way seems correct based on in-game testing and the unit tests
    if (orientation === 1) {
        const calculatedOrientation = 3;

        return {
            x: getTemplateLocalX(calculatedOrientation, x, y, sizeX, sizeY),
            y: getTemplateLocalY(calculatedOrientation, x, y, sizeX, sizeY)
        };
    }

    if (orientation === 3) {
        const calculatedOrientation = 1;

        return {
            x: getTemplateLocalX(calculatedOrientation, x, y, sizeX, sizeY),
            y: getTemplateLocalY(calculatedOrientation, x, y, sizeX, sizeY)
        };
    }

    return {
        x: getTemplateLocalX(orientation, x, y, sizeX, sizeY),
        y: getTemplateLocalY(orientation, x, y, sizeX, sizeY)
    };
}
