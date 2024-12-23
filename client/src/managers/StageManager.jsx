import {useEffect, useState} from 'react';
import LoadingStage from '../stages/LoadingStage.jsx';
import CharacterSelectStage from "../stages/CharacterSelectStage.jsx";
import GameStage from "../stages/GameStage.jsx";
import {useAtom, useAtomValue} from 'jotai';
import {connectionStatusAtom, localPlayerId, currentPageAtom} from '../js/atoms.js';
import {connect} from "./connectionManager.js";
import {init} from "../js/spriteFrameGrabber.js";
import EndScreen from "../stages/EndScreen.jsx";

const StageManager = () => {
    const [connectionStatus, setConnectionStatus] = useAtom(connectionStatusAtom);
    const [localPlayerIdValue, setLocalPlayerIdValue] = useAtom(localPlayerId);
    const currentScreen = useAtomValue(currentPageAtom)

    const [currentStage, setCurrentStage] = useState(<GameStage/>);
    const [loading, setLoading] = useState(true);

    // Initial useEffect for asset initialization and connection attempt
    useEffect(() => {
        const initialize = async () => {
            setLoading(true); // Start loading

            try {
                // Initialize assets
                await init();

                // Attempt connection
                await attemptConnect();
                console.log("Connection established!");

                // Check for playerID in session storage and set if exists
                const storedPlayerID = sessionStorage.getItem("playerID");
                if (storedPlayerID) {
                    setLocalPlayerIdValue(Number(storedPlayerID));
                }
            } catch (error) {
                console.error("Error during initialization or connection:", error);
            } finally {
                setLoading(false); // Stop loading after everything is done
            }
        };
        initialize();
    }, []); // Dependency array left empty to run only once on mount

    const attemptConnect = async () => {
        const serverUrl = import.meta.env.VITE_WEBSOCKET_URL;

        try {
            await connect(serverUrl);
            setConnectionStatus('connected');
        } catch (error) {
            console.error('Connection failed:', error);
            setConnectionStatus('disconnected');
        }
    };


    // Trigger stage update based on connection status and storedPlayer changes
    useEffect(() => {
        switch (currentScreen) {
            case "home" :
                setCurrentStage(<LoadingStage attemptConnect={attemptConnect}/>)
                break
            case "select" :
                setCurrentStage(<CharacterSelectStage/>)
                break;
            case "game" :
                setCurrentStage(<GameStage/>)
                break;
            case "end" :
                setCurrentStage(<EndScreen/>)
                break;
            default :
                setCurrentStage(<div>{`Unknown screen ${currentScreen}`}</div>)
        }
    }, [connectionStatus, localPlayerIdValue, currentScreen]); // Effect depends on connectionStatus and storedPlayer


    return (
        <>
            {
                loading ?
                    <h1>Loading assets TODO fix this, its ugly</h1>
                    :
                    currentStage
            }
        </>

    );
};

export default StageManager;
