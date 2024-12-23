import * as PIXI from 'pixi.js';
import missingPlayerUrl from '../../assets/spriteSheets/missingPlayer.png';
import developerSheetUrl from '../../assets/spriteSheets/developerSheet.png';
import projectmanagerSheetUrl from '../../assets/spriteSheets/projectmanagerSheet.png';
import testerSheetUrl from '../../assets/spriteSheets/testerSheet.png';
import buttonSheetUrl from '../../assets/buttonSheet.png';

// Button Sprite dimensions
const BUTTON_HEIGHT = 110;
const BUTTON_WIDTH = 222;
const buttonTexture = PIXI.BaseTexture.from(buttonSheetUrl);

// Sprite player dimensions
const SPRITE_HEIGHT = 96;
const SPRITE_WIDTH = 48;
const SPRITES_PER_DIRECTION = 6; // Number of frames per animation
const DAMAGE_FRAMES = 3;

export const TILE_WIDTH = 48;

// All textures available here
export const playerTextures = {
    PROJECT_MANAGER: PIXI.BaseTexture.from(projectmanagerSheetUrl),
    DEVELOPER: PIXI.BaseTexture.from(developerSheetUrl),
    TESTER: PIXI.BaseTexture.from(testerSheetUrl),
    MISSING: PIXI.BaseTexture.from(missingPlayerUrl)
};

// Object to store all textures for all player types
export const textures = {
    PROJECT_MANAGER: {},
    DEVELOPER: {},
    TESTER: {}
};

// Initialize the texture sets for all player types
export const init = () => {
    initPlayerTypeTextures('PROJECT_MANAGER');
    initPlayerTypeTextures('DEVELOPER');
    initPlayerTypeTextures('TESTER');
};

// Helper function to initialize the textures for a specific player type
const initPlayerTypeTextures = (playerType) => {
    const baseTexture = playerTextures[playerType];
    textures[playerType].running = initRunning(baseTexture);
    textures[playerType].idle = initIdle(baseTexture);
    textures[playerType].sitting = initSitting(baseTexture);
    textures[playerType].damage = initDamage(baseTexture);
};

// Function to fetch a sprite frame for a specific player type
const fetchFrame = (baseTexture, direction, frame, yOffsetMultiplier) => {
    const directionOffset = directionValue(direction);
    const xOffset = (directionOffset * SPRITES_PER_DIRECTION * SPRITE_WIDTH) + (frame * SPRITE_WIDTH);
    const yOffset = yOffsetMultiplier * SPRITE_HEIGHT;

    return new PIXI.Texture(baseTexture, new PIXI.Rectangle(xOffset, yOffset, SPRITE_WIDTH, SPRITE_HEIGHT));
};

// Fetch running frames
const initRunning = (baseTexture) => {
    const runningFrames = {};

    ["LEFT", "RIGHT", "UP", "DOWN"].forEach(direction => {
        const currentTextures = [];
        for (let i = 0; i < 6; i++) {
            currentTextures.push(fetchRunning(baseTexture, direction, i));
        }
        runningFrames[direction] = currentTextures;
    });

    return runningFrames;
};

const initIdle = (baseTexture) => {
    const idleFrames = {};

    ["LEFT", "RIGHT", "UP", "DOWN"].forEach(direction => {
        const currentTextures = [];
        for (let i = 0; i < 6; i++) {
            currentTextures.push(fetchIdle(baseTexture, direction, i));
        }
        idleFrames[direction] = currentTextures;
    });

    return idleFrames;
};

const initSitting = (baseTexture) => {
    const sittingFrames = {};

    ["LEFT", "RIGHT", "UP", "DOWN"].forEach(direction => {
        const currentTextures = [];
        for (let i = 0; i < 6; i++) {
            currentTextures.push(fetchSitting(baseTexture, direction, i));
        }
        sittingFrames[direction] = currentTextures;
    });

    return sittingFrames;
};

const initDamage = (baseTexture) => {
    const damageFrames = {};

    ["LEFT", "RIGHT", "UP", "DOWN"].forEach(direction => {
        const currentTextures = [];
        for (let i = 0; i < DAMAGE_FRAMES; i++) {
            currentTextures.push(fetchDamage(baseTexture, direction, i));
        }
        damageFrames[direction] = currentTextures;
    });

    return damageFrames;
};

// Maps direction to its corresponding row in the sprite sheet
const directionValue = (direction) => {
    switch (direction.toUpperCase()) {
        case "RIGHT": return 0;
        case "UP": return 1;
        case "LEFT": return 2;
        case "DOWN": return 3;
        default: return 1;
    }
};

const fetchIdle = (baseTexture, direction = "DOWN", frame = 0) => {
    return fetchFrame(baseTexture, direction, frame % SPRITES_PER_DIRECTION, 1); // Idle animation is at row 1
};

const fetchRunning = (baseTexture, direction = "DOWN", frame = 0) => {
    return fetchFrame(baseTexture, direction, frame % SPRITES_PER_DIRECTION, 2); // Running animation is at row 2
};

const fetchSitting = (baseTexture, direction = "RIGHT", frame = 0) => {
    const yOffsetMultiplier = 4; // Sitting is on row 4
    const frameCount = SPRITES_PER_DIRECTION;
    const directionOffset = (direction.toUpperCase() === "LEFT" ? 1 : 0);
    const xOffset = directionOffset * frameCount * SPRITE_WIDTH + (frame % frameCount) * SPRITE_WIDTH;

    return new PIXI.Texture(baseTexture, new PIXI.Rectangle(xOffset, yOffsetMultiplier * SPRITE_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT));
};

const fetchDamage = (baseTexture, direction = "DOWN", frame = 0) => {
    const frameNum = frame % DAMAGE_FRAMES;  // Loop within the 3 damage frames
    const directionOffset = directionValue(direction);  // Get the direction offset
    const xOffset = directionOffset * DAMAGE_FRAMES * SPRITE_WIDTH + frameNum * SPRITE_WIDTH;
    const yOffset = 19 * SPRITE_HEIGHT;  // The 19th row for the damage animation

    return new PIXI.Texture(baseTexture, new PIXI.Rectangle(xOffset, yOffset, SPRITE_WIDTH, SPRITE_HEIGHT));
};

export const fetchPlayButton = (pressed = false) => {
    const x = pressed ? BUTTON_WIDTH : 0;
    return new PIXI.Texture(buttonTexture, new PIXI.Rectangle(x, 0, BUTTON_WIDTH, BUTTON_HEIGHT));
};
