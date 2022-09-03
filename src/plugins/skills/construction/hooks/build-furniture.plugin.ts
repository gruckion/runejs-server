import { itemInteractionActionHandler } from '@engine/action';
import { Shop } from '@engine/config/shop-config';
import { widgets } from '@engine/config/config-handler';
import { BUILDABLE_FURNITURE } from '../data/furniture';
import { getBuildFurnitureFailureMessage } from '../util/requirements';
import { LandscapeObject } from '@runejs/filestore';
import { Position } from '@engine/world';

export const handler: itemInteractionActionHandler = ({ player, itemId }) => {
    const message = getBuildFurnitureFailureMessage(player, BUILDABLE_FURNITURE[itemId])
    if(message) {
        player.sendMessage(message);
        return;
    }


    player.sendMessage('You build a clay fireplace.');

    // TODO (Sigex): We probably want to temp store the object that was clicked
    // and then get it's location, rotation and type so we can place the object in the right place.
    const landscapeObject: LandscapeObject = {
        objectId: 13609,
        x: 6435,
        y: 6447,
        level: player.position.level,
        type: 10,
        orientation: 1
    }

    player.instance.spawnGameObject(landscapeObject);


    // player.outgoingPackets.removeLocationObject(landscapeObject, new Position(landscapeObject.x, landscapeObject.y, landscapeObject.level));
    // player.outgoingPackets.setLocationObject(landscapeObject, player.position, 0);
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
