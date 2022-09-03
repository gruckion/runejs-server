import { findItem } from '@engine/config';
import { Player } from '@engine/world/actor';
import { Furniture } from '../types';

export function getBuildFurnitureFailureMessage(player: Player, furniture: Furniture): string | null {
    if (!player.inventory.has(8794)) {
        console.log('no saw');
        return 'You need a saw and hammer in order to make furniture.';
    }

    if (!player.inventory.has(2347)) {
        console.log('no hammer');
        return 'You need a saw and hammer in order to make furniture.';
    }

    if (player.skills.construction.level < furniture.level) {
        console.log('not high enough level', player.skills.construction.level, furniture.level);
        return `You need to have a Construction level of ${furniture.level} to build that.`;
    }

    for (const requirement of furniture.requirements) {
        const amount = player.inventory.amount(requirement.itemId);

        if (amount < requirement.amount) {
            console.log('not enough', requirement.itemId, amount, requirement.amount);
            return `You need ${requirement.amount} x ${findItem(requirement.itemId).name} to build that.`;
        }
    }

    return null;
}
