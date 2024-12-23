import { Stomp } from "@stomp/stompjs";
import {
    localHeldTicket,
    localPlayerId,
    players,
    scoreAtom,
    stationProgress,
    ticketsAtom,
    timeLeftAtom,
    currentPageAtom
} from "../js/atoms.js";
import { store } from '../App'

let stompClient;

export const connect = async (url) => {
    console.log("start");
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url);

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            reject(new Error('WebSocket connection failed'));
        });

        stompClient = Stomp.over(socket);

        // Handle STOMP connection errors
        stompClient.connect({}, (frame) => {
            console.log('Connected:', frame);
            setupSubscriptions();
            requestState();

            resolve();
        }, (error) => {
            console.error('STOMP connection error:', error);
            stompClient = null;
            reject(new Error('STOMP connection failed'));
        });
    });
};

const setupSubscriptions = () => {
    if (!stompClient) return;

    stompClient.subscribe('/topic/player/move', (message) => {
        updatePlayerPosition(message)
    });

    stompClient.subscribe('/topic/ticket/create', (message) => {
        updateNewTicket(message)
    });

    stompClient.subscribe('/topic/player/ticket/pickUp', (message) => {
        updateTicketPickUp(message)
    })

    stompClient.subscribe('/topic/player/ticket/drop', (message) => {
        updateTicketDrop(message)
    })

    stompClient.subscribe('/topic/timerUpdate', (message) => {
        updateGameTimer(message)
    })

    stompClient.subscribe('/topic/scoreUpdate', (message) => {
        updateScore(message)
    })

    stompClient.subscribe('/topic/stations', (message) => {
        updateStations(message)
    })

    stompClient.subscribe('/topic/ticket/resolve', (message) => {
        updateTicketComplete(message)
    })

    stompClient.subscribe('/topic/ticket/task/completionUpdate', (message) => {
        updateStationProgress(message)
    })

    stompClient.subscribe('/topic/gameCompleted', () => {
        store.set(currentPageAtom, "end")
    })
};

export const requestState = async () => {
    if (!stompClient) {
        console.warn('Cannot request state: not connected.');
        return;
    }
    stompClient.send('/app/players');

    // Return a Promise that resolves from server response
    return new Promise((resolve, reject) => {
        const subscription = stompClient.subscribe('/topic/players', (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                console.log(parsedMessage)
                // Update the playerMap with the parsedMessage
                const updatedPlayers = {
                    1: {
                        playerRole: parsedMessage[0].role,
                        direction: parsedMessage[0].direction,
                        x: parsedMessage[0].tile.x,
                        y: parsedMessage[0].tile.y,
                    },
                    2: {
                        playerRole: parsedMessage[1].role,
                        direction: parsedMessage[1].direction,
                        x: parsedMessage[1].tile.x,
                        y: parsedMessage[1].tile.y,
                    },
                    3: {
                        playerRole: parsedMessage[2].role,
                        direction: parsedMessage[2].direction,
                        x: parsedMessage[2].tile.x,
                        y: parsedMessage[2].tile.y,
                    },
                };
                store.set(players, updatedPlayers);

                resolve(parsedMessage); // Resolve the Promise with the parsed message
            } catch (error) {
                reject('Failed to parse message' + error);
            }

            // memory leak avoidance
            subscription.unsubscribe();
        });
    });
};

export const sendPlayerMovement = (direction) => {
    if (!stompClient){
        console.warn('Cannot send movement: not connected.');
        return
    }

    const playerId = store.get(localPlayerId)

    if (playerId === -1){
        console.warn('Cannot send movement: playerID not set');
    }

    console.log("app/player/move -> " + JSON.stringify({ playerId, direction }))
    stompClient.send("/app/player/move", {}, JSON.stringify({ playerId, direction }));
};

export const sendPlayerAction = (actionType) => {
    if (!stompClient){
        console.warn('Cannot send movement: not connected.');
        return
    }

    const playerId = store.get(localPlayerId)

    switch (actionType){
        case 'PICKUP':
            stompClient.send("/app/player/ticket/pickUp", {}, JSON.stringify({playerId}));
            break;
        case 'DROP':
            stompClient.send("/app/player/ticket/drop", {}, JSON.stringify({playerId}))
            break;
        default:
            console.error("Action type not recognised")
    }


}

export const fetchAllTickets = async () => {
    if (!stompClient) {
        console.warn('Cannot fetch tickets: not connected.');
        return;
    }

    stompClient.send("/app/tickets", {});

    return new Promise((resolve, reject) => {
        const subscription = stompClient.subscribe('/topic/tickets', (message) => {
            try {
                const tickets = JSON.parse(message.body);
                console.log("Tickets received from fetchAllTickets: " + JSON.stringify(tickets));

                // Transform the tickets array into a map with relevant information
                const ticketMap = tickets.reduce((acc, ticket) => {
                    acc[ticket.id] = {
                        id: ticket.id,
                        x: ticket.tile.x,
                        y: ticket.tile.y,
                        title: ticket.ticketTitle,
                        held: false, // Assuming "held" is initially set to false
                    };
                    return acc;
                }, {});

                // Update the ticketsAtom with the transformed ticketMap
                store.set(ticketsAtom, ticketMap);

                console.log("Tickets stored in atom now: " + JSON.stringify(store.get(ticketsAtom)));
                resolve(); // Resolve with the list of tickets
            } catch (error) {
                reject('Failed to parse ticket response' + error);
            }

            subscription.unsubscribe();
        });
    });
};



export const activatePlayer = async (playerId, activate = true) => {
    if (!stompClient) {
        console.warn('Cannot activate player: not connected.');
        return;
    }
    console.log(playerId)
    // Send the activation request
    stompClient.send("/app/player/activate", {}, JSON.stringify({ playerId, activate }));

    // Return a Promise that resolves when the server responds
    return new Promise((resolve, reject) => {
        const subscription = stompClient.subscribe('/topic/player/activate', async (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                await fetchAllTickets();
                console.log("TEST1")
                // Request stations
                stompClient.send("/app/stations", {});
                resolve(parsedMessage); // Resolve the Promise with the updated player map
            } catch (error) {
                reject('Failed to parse activation response' + error);
            }

            // Unsubscribe to avoid memory leaks
            subscription.unsubscribe();
        });
    });
};

const updatePlayerPosition = (message) => {
    try {
        const parsedMessage = JSON.parse(message.body);
        const { id, tile, direction } = parsedMessage;
        console.log(parsedMessage)
        store.set(players, (prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                x: tile.x,
                y: tile.y,
                direction,
            },
        }));


    } catch (error) {
        console.error('Failed to parse or update playerMap:', error);
    }
}

const updateNewTicket = (message) => {
    try {
        const parsedMessage = JSON.parse(message.body);
        console.log(parsedMessage)
        const { id, tile, ticketTitle} = parsedMessage;

        store.set(ticketsAtom, (prevTickets) => ({
            ...prevTickets,
            [id]: { id: id, x: tile.x, y: tile.y, title: ticketTitle, held: false },
        }));

    } catch (error){
        console.error('Failed to parse ticket:', error);
    }
}

const updateTicketPickUp = (message) => {
    try {
        const parsedMessage = JSON.parse(message.body);
        const { id, heldTicket } = parsedMessage;

        if (heldTicket === null) {
            console.log("No ticket to pick up");
            return;
        }

        const ticketHeldId = heldTicket.id;

        // Get the current state of the stationProgress map
        const stationProgMap = store.get(stationProgress);
        console.log("MAP: " + JSON.stringify(stationProgMap))

        // Create a new map without the entry where ticketId matches ticketHeldId
        const newMap = new Map(
            // eslint-disable-next-line no-unused-vars
            Array.from(stationProgMap).filter(([key, value]) => value.ticketId !== ticketHeldId)
        );

        store.set(stationProgress, newMap)


        // Update the held value of the specific ticket in ticketsAtom
        store.set(ticketsAtom, (prevTickets) => {
            // Check if the ticket exists in the map
            if (prevTickets[ticketHeldId]) {
                return {
                    ...prevTickets,
                    [ticketHeldId]: {
                        ...prevTickets[ticketHeldId],
                        held: true, // Change the held value to true
                    },
                };
            }
            // If the ticket doesn't exist, return the previous state unchanged
            return prevTickets;
        });

        // Update the localHeldTicket for the local player if the ID matches
        if (id === store.get(localPlayerId)) {
            store.set(localHeldTicket, heldTicket);
        }

    } catch (error) {
        console.error('Failed to parse player that attempted to pick up ticket:', error);
    }
};

const updateTicketDrop = (message) => {
    try {
        const ticket = JSON.parse(message.body);
        const { id, tile, ticketTitle} = ticket;

        if (ticket.id === store.get(localHeldTicket)?.id) {
            store.set(localHeldTicket, null);
        }

        // Update the held value of the specific ticket in ticketsAtom
        store.set(ticketsAtom, (prevTickets) => {
            // Check if the ticket exists in the map
            if (prevTickets[id]) {
                return {
                    ...prevTickets,
                    [id]: { id: id, x: tile.x, y: tile.y, title: ticketTitle, held: false }
                };
            }
            // If the ticket doesn't exist, return the previous state unchanged
            return prevTickets;
        });

    } catch (error) {
        console.error('Failed to parse ticket drop message:', error);
    }
};

const updateGameTimer = (message) => {
    try {
        const time = JSON.parse(message.body);
        store.set(timeLeftAtom, time)

    } catch (error) {
        console.error('Failed to parse game timer message:', error);
    }
}

const updateScore = (message) =>{
    try {
        const score = JSON.parse(message.body);
        store.set(scoreAtom, score)

    } catch (error) {
        console.error('Failed to parse score message:', error);
    }
}

const updateStations = (message) => {
    try {
        const score = JSON.parse(message.body);
        console.log("STATION: " + JSON.stringify(score))

    } catch (error) {
        console.error('Failed to parse score message:', error);
    }
}

const updateTicketComplete = (message) => {
    try {
        const ticket = JSON.parse(message.body);

        // Remove the ticket from ticketsAtom
        store.set(ticketsAtom, (prevTickets) => {
            // Create a shallow copy of the previous tickets
            const updatedTickets = { ...prevTickets };

            // Check if the ticket exists in the map
            if (updatedTickets[ticket.id]) {
                delete updatedTickets[ticket.id]; // Remove the ticket from the map
            }

            // Return the updated tickets map
            return updatedTickets;
        });

    } catch (error) {
        console.error('Failed to parse ticket message:', error);
    }
};

const updateStationProgress = (message) => {
    try {
        const messageData = JSON.parse(message.body);
        const stationType = messageData.stationType
        const ticket = messageData.ticket
        const ticketId = ticket.id

        let task;
        if (ticket && ticket.tasks && Array.isArray(ticket.tasks)) {
            task = ticket.tasks.find(t => t.type === stationType); // finding the task with matching StationType
        }

        const progress = task.completionTime / task.completionTimeTotal
        store.set(stationProgress, (prevProgress) => {
            // Check if the ticket exists in the map
                return {
                    ...prevProgress,
                    [stationType]: {progress, ticketId}
                };
        });

        console.log("TICKET: " + ticket.id)




    } catch (error) {
        console.error('Failed to parse ticket message:', error);
    }
}





