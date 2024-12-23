import { useEffect, useRef } from 'react';
import { AnimatedSprite } from '@pixi/react';
import { textures, TILE_WIDTH } from "../js/spriteFrameGrabber.js";

// eslint-disable-next-line react/prop-types
const Player = ({ player, mapPosition }) => {
    const spriteRef = useRef(null);

    // Use useEffect to restart the animation when the direction changes
    useEffect(() => {
        if (spriteRef.current) {
            spriteRef.current.textures = textures[player.playerRole].running[player.direction];
            spriteRef.current.gotoAndPlay(0);
        }
    }, [player.direction, player.playerRole]);

    // Calculate player position relative to the map
    const playerPositionX = mapPosition.x + (player.x * TILE_WIDTH);
    const playerPositionY = mapPosition.y + (player.y * TILE_WIDTH) - TILE_WIDTH;

    return (
        <AnimatedSprite
            ref={spriteRef}
            key={player.id}
            isPlaying={true}
            textures={textures[player.playerRole].running[player.direction]}
            animationSpeed={0.15}
            x={playerPositionX}
            y={playerPositionY}
        />
    );
};

export default Player;
