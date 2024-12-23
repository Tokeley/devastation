import { store } from '../App';
import {players as playerAtoms, localPlayerId, localHeldTicket} from "./atoms.js";
import {sendPlayerMovement, sendPlayerAction} from '../managers/connectionManager.js'

export default function keyHandler() {

    // Helper function to handle key actions
    const handleKeyPress = (key) => {
        // Get the player map state
        const players = store.get(playerAtoms);
        const localPlayerIdValue = store.get(localPlayerId);
        const heldTicket = store.get(localHeldTicket);
        const localCharacter = players[localPlayerIdValue]; // Get the local player's data

        if (!localCharacter) {
            console.warn("Local character not found in playerMap.");
            return;
        }

        let newPosition = { ...localCharacter };

        console.log("KEY : [" + key + "]")
        switch (key) {
            case 'w':
                // Move player up
                console.log("W pressed");
                sendPlayerMovement('UP');
                break;
            case 'a':
                // Move player left
                console.log("A pressed");
                sendPlayerMovement('LEFT');
                break;
            case 's':
                // Move player down
                console.log("S pressed");
                sendPlayerMovement('DOWN');
                break;
            case 'd':
                // Move player right
                console.log("D pressed");
                sendPlayerMovement('RIGHT');
                break;
            case ' ':
                // Pick / drop ticket
                if (heldTicket !== null) {
                    sendPlayerAction('DROP')
                } else {
                    sendPlayerAction('PICKUP'); // Replace with your actual backend action
                }
                break;
            default:
                return; // Exit if the key is not handled
        }
    };

    // Keydown event listener
    const onKeyDown = (event) => {
        const key = event.key.toLowerCase();
        console.log("keyDown:" + event.type);
        if (['w', 'a', 's', 'd', ' '].includes(key)) {
            handleKeyPress(key);
        }
    };

    // Attach event listeners when the component is mounted
    document.addEventListener('keydown', onKeyDown);

    // Cleanup event listeners when the component is unmounted
    return () => {
        document.removeEventListener('keydown', onKeyDown);
    };
}
