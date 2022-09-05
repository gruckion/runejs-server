import { MAP_SIZE } from '../con-constants';
import { Room } from './room';

export class House {

    public rooms: Room[][][];
    // TODO add object

    public constructor() {
        this.rooms = new Array(4);
        for(let level = 0; level < 4; level++) {
            this.rooms[level] = new Array(MAP_SIZE);
            for(let x = 0; x < MAP_SIZE; x++) {
                this.rooms[level][x] = new Array(MAP_SIZE).fill(null);

                if(level === 0) {
                    for(let y = 0; y < MAP_SIZE; y++) {
                        this.rooms[level][x][y] = new Room('empty_grass');
                    }
                }
            }
        }
    }

    public copyRooms(rooms: Room[][][]): void {
        for(let level = 0; level < 4; level++) {
            for(let x = 0; x < MAP_SIZE; x++) {
                for(let y = 0; y < MAP_SIZE; y++) {
                    const existingRoom = rooms[level][x][y] ?? null;
                    this.rooms[level][x][y] = existingRoom ? new Room(existingRoom.type, existingRoom.orientation) : null;
                }
            }
        }

        // TODO remove example hack
        this.rooms[0][3][6] = new Room('study');
        this.rooms[1][3][6] = new Room('study');
        this.rooms[2][3][6] = new Room('study');
        this.rooms[3][3][6] = new Room('roof_shape_I');
    }

}
