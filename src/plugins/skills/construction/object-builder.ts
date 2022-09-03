import {
    objectInteractionActionHandler
} from '@engine/action/pipe/object-interaction.action';
import { findItem, widgets } from '@engine/config';
import { ItemContainer } from '@engine/world';
import { FURNITURE_FOR_PLACEHOLDER } from './data/furniture';
import { getBuildFurnitureFailureMessage } from './util/requirements';

const furnitureInterfaceIds = [
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

export const constructionObjectHandler: objectInteractionActionHandler = ({ player, object }) => {
    const CREATION_WIDGET_ID = widgets.poh.furnitureCreationMenu.widgetId

    const container = new ItemContainer(3);

    const furnitureSettings = FURNITURE_FOR_PLACEHOLDER[object.objectId];
    for (const [index, furniture] of furnitureSettings.entries()) {
        container.set(index, { itemId: furniture.itemId, amount: 1 }, false);

        const interfaceInfo = furnitureInterfaceIds[index]

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
    player.interfaceState.openWidget(widgets.poh.furnitureCreationMenu.widgetId, { slot: 'screen' });
};
