import { Position } from '@engine/world/position';
import { ConstructedChunk, ConstructedRegion } from '@engine/world/map/region';
import { MAP_SIZE, RoomType, roomTemplates } from '../con-constants';
import { Furniture } from '../types';

export class Room extends ConstructedChunk {

    public readonly type: RoomType;

    public readonly furniture: Furniture[] = [];

    public constructor(type: RoomType, orientation: number = 0) {
        super(orientation);
        this.type = type;

        if (type === 'study') {
            this.furniture.push({ key: 'wall_space_1', replacementId: 13662 });
            this.furniture.push({ key: 'wall_space_2', replacementId: 13663 });
            this.furniture.push({ key: 'wall_space_3', replacementId: 13664 });
            this.furniture.push({ key: 'wall_space_4', replacementId: 13662 });

            this.furniture.push({ key: 'bookcase_1', replacementId: 13599 });
            this.furniture.push({ key: 'bookcase_2', replacementId: 13599 });

            this.furniture.push({ key: 'globe', replacementId: 13653 });
            this.furniture.push({ key: 'telescope', replacementId: 13656 });
            this.furniture.push({ key: 'crystal_ball', replacementId: 13661 });
            this.furniture.push({ key: 'lectern', replacementId: 13648 });
        }
    }

    public getTemplatePosition(): Position {
        return roomTemplates[this.type];
    }

}
