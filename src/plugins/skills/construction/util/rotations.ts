import { getTemplateLocalX, getTemplateLocalY } from '@engine/world/map/region';

type ChunkCoordinate = {
    x: number; // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    y: number; // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

/**
 * Rotates a chunk coordinate by a given orientation
 *
 * This supports objects that are more than 1x1 in size, but the size
 * parameters are optional so you can choose to just rotate coordinates.
 *
 * @param chunkCoordinate The chunk coordinate to rotate
 * @param orientation The orientation to rotate by
 * @param sizeX (optional, default 1) The size of the object in the X direction
 * @param sizeY (optional, default 1) The size of the object in the Y direction
 *
 * @returns The rotated chunk coordinate
 *
 * @example rotateChunkCoordinate({ x: 0, y: 3 }, 1) -> { x: 3, y: 7 }
 */
export function rotateChunkCoordinate({ x, y }: ChunkCoordinate, orientation: number, sizeX = 1, sizeY = 1) {
    // TODO (jameskmonger) either getTemplateLocalX/Y has orientations 1/3 back to front, or I do
    //              I think the former, but I'm not sure
    //             I think the latter, but I'm not sure
    //
    //            could it be that the origin is in the top left, not the bottom left?

    return {
        x: getTemplateLocalX(orientation, x, y, sizeX, sizeY),
        y: getTemplateLocalY(orientation, x, y, sizeX, sizeY)
    };
}
