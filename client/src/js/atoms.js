import { atom } from 'jotai';

// Connection status atom
export const connectionStatusAtom = atom('disconnected');

// Players atom
export const players = atom({
    1: { playerRole: 'PROJECT_MANAGER', direction: 'DOWN', x: 0, y: 0 },
    2: { playerRole: 'DEVELOPER', direction: 'DOWN', x: 0, y: 0 },
    3: { playerRole: 'TESTER', direction: 'DOWN', x: 0, y: 0 },
});

// Local player ID atom
export const localPlayerId = atom(-1);

// Local held ticket
export const localHeldTicket = atom(null);

// Tickets atom
export const ticketsAtom = atom(new Map());

// Game time
export const timeLeftAtom = atom();

// Score
export const scoreAtom = atom(0);

//what page is currently showing
export const currentPageAtom = atom("home")
//Station Progress
export const stationProgress = atom(new Map());
