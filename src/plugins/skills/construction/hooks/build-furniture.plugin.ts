import { itemInteractionActionHandler } from '@engine/action';
import { Shop } from '@engine/config/shop-config';
import { widgets } from '@engine/config/config-handler';
import { BUILDABLE_FURNITURE } from '../data/furniture';
import { getBuildFurnitureFailureMessage } from '../util/requirements';

export const handler: itemInteractionActionHandler = ({ player, itemId }) => {
    const message = getBuildFurnitureFailureMessage(player, BUILDABLE_FURNITURE[itemId])
    if(message) {
        player.sendMessage(message);
        return;
    }

    player.sendMessage('you about to build something nice brother in ur POH');
    player.sendMessage('shame its not a regen pool nerd');
};

export default {
    pluginId: 'rs:build_furniture',
    hooks: [
        {
            type: 'item_interaction',
            widgets: widgets.poh.furnitureCreationMenu,
            options: 'build',
            handler,
            cancelOtherActions: false
        }
    ]
};
