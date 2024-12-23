import { useAtomValue, useSetAtom } from "jotai";
import {connectionStatusAtom, currentPageAtom} from '../js/atoms.js'
import { Sprite, Stage} from "@pixi/react";
import {useEffect, useState} from "react";
import * as PIXI from "pixi.js";
import backgroundURL from "../../assets/background.png";
import titleURL from "../../assets/DEV-A-STATION.png";
import BlankButton from "../components/BlankButton.jsx";
import HowToPlay from "../components/HowToPlay.jsx";

const LoadingStage = ({attemptConnect}) => {
    const connectionStatus = useAtomValue(connectionStatusAtom)
    const setCurrentPage = useSetAtom(currentPageAtom)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [showHowToPlay, setShowHowtoPlay] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Stage
            width={windowSize.width}
            height={windowSize.height}
            options={{ backgroundColor: 0x1099bb }}
        >
            <Sprite texture={PIXI.Texture.from(backgroundURL)} width={windowSize.width} height={windowSize.height}/>
            <Sprite texture={PIXI.Texture.from(titleURL)} anchor={0.5} y={windowSize.height * 0.2} x={windowSize.width / 2}/>
            <BlankButton
                text={'How to Play'}
                x={(windowSize.width / 2) + 200}
                y={windowSize.height / 2}
                size={'large'}
                action={() => setShowHowtoPlay(true)}
            />
            {
                connectionStatus === 'disconnected' && (
                    <BlankButton
                        text={'Try Connect'}
                        x={(windowSize.width / 2) - 200}
                        y={windowSize.height / 2}
                        size={'large'}
                        action={attemptConnect}
                    />
                )
            }
            {
                connectionStatus === 'connected' && (
                    <BlankButton
                        text={'Play'}
                        x={(windowSize.width / 2) - 600}
                        y={windowSize.height / 2}
                        size={'large'}
                        action={() => {
                            setCurrentPage("select")
                        }}
                    />

                )
            }
            {showHowToPlay && <HowToPlay setShow={setShowHowtoPlay} /> }
        </Stage>
    );
};

export default LoadingStage;
