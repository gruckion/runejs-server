type ChunkCoordinate = {
    x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function rotateChunkCoordinate({ x, y }: ChunkCoordinate, orientation: number) {
    if (orientation === 0) {
        return { x, y };
    }

    if (orientation === 1) {
        return { x: 7 - y, y: x };
    }
}


//            0     1     2     3     4     5     6     7
//
//
//     0                       Y1
//
//     1           X0                            X1
//
//     2
//
//     3     Y0                                        Y2
//
//     4
//
//     5
//
//     6          X3                             X2
//
//     7                             Y3
