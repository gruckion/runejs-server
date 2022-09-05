import { Player } from '@engine/world/actor';

/**
 * Sets the furniture placeholder key which is currently being built by the player.
 *
 * This is to store state during a single transaction and should be reset when the transaction is complete.
 *
 * The transaction is designed like so:
 *      - player 'builds' on placeholder object
 *      - placeholder key is determined and set on metadata (this function)
 *      - interface is opened for player to select item to build
 *      - player selects item to build OR closes interface
 *      - placeholder key is reset on metadata ({@link clearPlayerBuildingPlaceholderKey})
 *
 * @param player The player to set the placeholder key for.
 * @param placeholderKey The placeholder key to set.
 *
 * @author jameskmonger
 */
export function setPlayerBuildingPlaceholderKey(player: Player, key: string) {
    player.metadata.poh_buildingPlaceholderKey = key;
    player.sendMessage(`[debug] You are now building ${ player.metadata.poh_buildingPlaceholderKey}`);
}

/**
 * Clears the furniture placeholder key for a player.
 *
 * @param player The player to clear the placeholder key for.
 *
 * @author jameskmonger
 */
export function clearPlayerBuildingPlaceholderKey(player: Player) {
    player.metadata.poh_buildingPlaceholderKey = null;
}

/**
 * Gets the current furniture placeholder key for a player.
 *
 * @param player The player to get the placeholder key for.
 * @returns The placeholder key, or null if none is set.
 *
 * @author jameskmonger
 */
export function getPlayerBuildingPlaceholderKey(player: Player) {
    return player.metadata.poh_buildingPlaceholderKey as string | null;
}
