import {
    objectInteractionActionHandler
} from '@engine/action/pipe/object-interaction.action';
import { findItem, widgets } from '@engine/config';
import { ItemContainer, Position } from '@engine/world';
import { Player } from '@engine/world/actor';
import { logger } from '@runejs/common';
import { LandscapeObject } from '@runejs/filestore';
import { FURNITURE_FOR_PLACEHOLDER } from './data/furniture';
import { Room } from './models/room';
import { setPlayerBuildingPlaceholderKey } from './player/metadata';
import { findPlaceholderObjectInRoom } from './room/find-placeholder';
import { getCurrentRoom } from './util';
import { getBuildFurnitureFailureMessage } from './util/requirements';

/**
 * Widget childrn ids for the 2 choice make furniture interface
 * and varp settings IDs for the requirements met symbol.
 *
 * @author sigex
 */
const THREE_CHOICE_FURNITURE_INTERFACE_IDS = [
    {
        titleId: 91,
        levelId: 110,
        requirementIds: [ 92, 93, 94, 95],
        varpCanBuild: 261
    },
    {
        titleId: 96,
        levelId: 111,
        requirementIds: [ 97, 98, 99, 100],
        varpCanBuild: 262
    },
    {
        titleId: 101,
        levelId: 112,
        requirementIds: [ 102, 103, 104, 105],
        varpCanBuild: 263
    }
]

/**
 * Sets the players meta data to store what placeholder object they just interacted with
 * used in construction to allow us to find the placeholder in the room
 *
 * @param player player interacting with object
 * @param object the object the player interacted with
 * @param objectWorldPosition objects position in the world
 *
 * @author jameskmonger
 */
function storeMetadata(player: Player, object: LandscapeObject, objectWorldPosition: Position) {
    const roomCoords = getCurrentRoom(player);
    const room = player.metadata.customMap.chunks[roomCoords.level][roomCoords.x][roomCoords.y] as Room;

    const placeholder = findPlaceholderObjectInRoom(room, object.objectId, {
        x: objectWorldPosition.localX,
        y: objectWorldPosition.localY
    });

    if (!placeholder) {
        logger.warn(`Player ${player.username} tried to build furniture at an invalid position`);
        player.sendMessage('oops! go andd read the logs! now! go!');
        return;
    }

    setPlayerBuildingPlaceholderKey(player, placeholder[0]);
}

/**
 * Handles an object interaction from a player clicking the 'build' option on a placeholder object
 *
 * @author sigex
 */
export const constructionObjectHandler: objectInteractionActionHandler = ({ player, object, position }) => {
    const CREATION_WIDGET_ID = widgets.poh.furnitureCreationMenu.widgetId

    const container = new ItemContainer(3);

    storeMetadata(player, object, position);


    const furnitureSettings = FURNITURE_FOR_PLACEHOLDER[object.objectId];

    // TODO: build widget to handle furnitureCreationMenu2
    // the varp is 261 and the bits are shifted
    // e.g. if the 1st icon is on, then value is 0b00000010
    //      if the 1st and 7th are on, then      0b10000010
    if (furnitureSettings.length > 3) {
        player.sendMessage('too many furniture options to render for now, sorry mate! but youre')
        player.sendMessage('in the right place, just need to add a widget for each furniture type')
        player.sendMessage('and then add the furniture to the widget')
        player.sendMessage('we will continue to work on this, but for now, just build something else')
        player.sendMessage('sorry again bro, you were in the right place but at the wrong time')
        return;
    }

    // TODO (jameskmonger) this function is very specific to the 3-choice interface
    //                      and should probably be pulled out to a specific function to handle that interface
    //                      as the 7-choice interface uses varps differently
    for (const [index, furniture] of furnitureSettings.entries()) {
        if(!furniture) {
            console.log({ objectId: object.objectId, furniture, furnitureSettings })
            continue
        }
        container.set(index, { itemId: furniture.itemId, amount: 1 }, false);

        const interfaceInfo = THREE_CHOICE_FURNITURE_INTERFACE_IDS[index]

        const canBuild = getBuildFurnitureFailureMessage(player, furniture) === null;
        player.outgoingPackets.updateClientConfig(interfaceInfo.varpCanBuild, canBuild ? 1 : 0);

        player.outgoingPackets.updateWidgetString(CREATION_WIDGET_ID, interfaceInfo.titleId, findItem(furniture.itemId).name)
        player.outgoingPackets.updateWidgetString(CREATION_WIDGET_ID, interfaceInfo.levelId, `Level ${furniture.level}`)

        for (const [ requirementIndex, requirementInterfaceId ] of interfaceInfo.requirementIds.entries()) {
            const furnitureRequirement = furniture.requirements[requirementIndex];

            // this requirement slot isn't used by this furniture, so empty the text
            if (!furnitureRequirement) {
                player.outgoingPackets.updateWidgetString(CREATION_WIDGET_ID, requirementInterfaceId, '')
                continue;
            }

            player.outgoingPackets.updateWidgetString(CREATION_WIDGET_ID, requirementInterfaceId, `${furnitureRequirement.amount} ${findItem(furnitureRequirement.itemId).name}`)
        }
    }

    player.outgoingPackets.sendUpdateAllWidgetItems(widgets.poh.furnitureCreationMenu, container);
    player.interfaceState.openWidget(CREATION_WIDGET_ID, { slot: 'screen' });
};
