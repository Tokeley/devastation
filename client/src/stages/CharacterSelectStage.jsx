import { useState, useEffect } from "react";
import { Stage, Container, AnimatedSprite, Sprite } from '@pixi/react';
import { textures } from "../js/spriteFrameGrabber.js";
import { localPlayerId, currentPageAtom } from "../js/atoms.js";
import { useSetAtom } from "jotai";
import { requestState, activatePlayer } from "../managers/connectionManager.js";
import { store } from "../App.jsx";
import backgroundURL from '../../assets/SelectPlayerBackground.png';
import BlankButton from "../components/BlankButton.jsx";
import TitleURL from "../../assets/SelectYourCharacter.png"
import * as PIXI from 'pixi.js';

const CharacterSelectStage = () => {
    const [playerMap, setPlayerMap] = useState([]);
    const [loading, setLoading] = useState(true);
    const setPage = useSetAtom(currentPageAtom)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        updatePlayerSelection();

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const updatePlayerSelection = async () => {
        setLoading(true);
        try {
            const playerMap = await requestState();
            setPlayerMap(playerMap);
        } catch (error) {
            console.error('Failed to fetch players:', error);
        } finally {
            setLoading(false);
        }
    };

    const setSessionPlayer = async (playerId) => {
        try {
            const player = await activatePlayer(playerId);
            if (sessionStorage.getItem('playerID') === null){
                sessionStorage.setItem('playerID', player.id);
                store.set(localPlayerId, player.id);
                setPage("game")
            }
            await updatePlayerSelection();
        } catch (error) {
            console.error('Failed to activate player:', error);
        }
    };

    // Constants for layout based on window size
    const stageWidth = windowSize.width;
    const stageHeight = windowSize.height;
    const buttonYPosition = stageHeight * 0.6;
    const characterYPosition = stageHeight * 0.4;
    const characterScale = stageWidth * 0.001;

    return (
        <div>
            {loading ? (
                <p>Loading players...</p>
            ) : (
                <Stage
                    width={stageWidth}
                    height={stageHeight}
                    options={{ backgroundColor: 0x1099bb }}
                >
                    {/* Background */}
                    <Container>
                        <Sprite texture={PIXI.Texture.from(backgroundURL)} width={stageWidth} height={stageHeight}/>
                    </Container>

                    {/* title */}
                    <Sprite texture={PIXI.Texture.from(TitleURL)} anchor={0.5} y={stageHeight * 0.2} x={stageWidth / 2}/>
                    {/* Characters running above buttons */}
                    <Container>
                        {playerMap.map((player, index) => {
                            const xPosition = (index + 1) * (stageWidth / (playerMap.length + 1));
                            return (
                                <Container key={player.id}>
                                    {/* Animated character running in place */}
                                    <AnimatedSprite
                                        textures={textures[player.role].running["DOWN"]}
                                        animationSpeed={0.15}
                                        isPlaying={true}
                                        anchor={0.5}
                                        x={xPosition}
                                        y={characterYPosition}
                                        scale={{ x: characterScale, y: characterScale }}
                                    />

                                    <BlankButton
                                        text={player.role}
                                        size="medium"
                                        action={() => setSessionPlayer(player.id)}
                                        x={xPosition - 180}
                                        y={buttonYPosition}
                                        active={!player.active}
                                    />
                                </Container>
                            );
                        })}
                    </Container>
                </Stage>
            )}
        </div>
    );
};

export default CharacterSelectStage;
