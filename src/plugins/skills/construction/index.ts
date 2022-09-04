import { PlayerInitAction } from '@engine/action';
import { instance1, instance1Max, instance2, instance2Max, roomBuilderButtonMap } from './con-constants';
import { doorHotspotHandler, roomBuilderWidgetHandler } from './room-builder';
import { openHouse } from './house';
import { widgets } from '@engine/config';
import { houseOptions } from './house-options';
import { constructionObjectHandler } from './object-builder';


export default {
    pluginId: 'rs:construction',
    hooks: [
        {
            type: 'button',
            widgetIds: widgets.poh.roomCreationMenu,
            buttonIds: Object.keys(roomBuilderButtonMap).map(key => parseInt(key, 10)),
            handler: roomBuilderWidgetHandler
        },
        {
            type: 'button',
            widgetId: widgets.settingsTab,
            buttonIds: 5,
            handler: houseOptions
        },
        {
            type: 'object_interaction',
            // TODO (Sigex): Doors for first style POH only, need to allow other floors too
            objectIds: [ 15313, 15314 ],
            options: 'build',
            walkTo: true,
            handler: doorHotspotHandler
        },
        {
            type: 'object_interaction',
            // TODO (Sigex): add more object interactions
            objectIds: [ 15380, 15361, 15418 ],
            options: 'build',
            walkTo: true,
            handler: constructionObjectHandler
        },
        {
            type: 'player_init',
            handler: ({ player }: PlayerInitAction): void => {
                if(player.position.within(instance1, instance1Max, false) ||
                    player.position.within(instance2, instance2Max, false)) {
                    openHouse(player);
                }
            }
        }
    ]
};
