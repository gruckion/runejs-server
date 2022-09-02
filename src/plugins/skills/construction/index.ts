import { PlayerCommandAction } from '@engine/action';
import { PlayerInitAction } from '@engine/action';
import { instance1, instance1Max, instance2, instance2Max, roomBuilderButtonMap } from './con-constants';
import { doorHotspotHandler, roomBuilderWidgetHandler } from './room-builder';
import { openHouse } from './house';
import { saveHouse } from './home-saver';
import { widgets } from '@engine/config';
import { houseOptions } from './house-options';


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
            type: 'player_command',
            commands: [ 'con', 'poh', 'house' ],
            handler: ({ player }: PlayerCommandAction): void => openHouse(player)
        },
        {
            type: 'player_command',
            commands: [ 'savepoh', 'savehouse' ],
            handler: ({ player }: PlayerCommandAction): void => {
                player.sendMessage(`Saving house data...`);
                saveHouse(player);
            }
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
