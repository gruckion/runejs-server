import { buttonActionHandler } from '@engine/action/pipe/button.action';
import { widgets } from '@engine/config/config-handler';

export const houseOptions: buttonActionHandler = ({ player }) => {
    player.interfaceState.openWidget(widgets.poh.houseOptions, {
        slot: 'tabarea',
        multi: false
    });
}
