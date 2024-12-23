import { useAtomValue } from "jotai";
import { scoreAtom } from "../js/atoms.js";
import background from '../../assets/SelectPlayerBackground.png';

const EndScreen = () => {
    const score = useAtomValue(scoreAtom);

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                <h1 style={styles.title}>Game Over</h1>
                <p style={styles.score}>{`Your Score: ${score}`}</p>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(16,94,211,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    container: {
        textAlign: 'center',
        color: '#fff',
        padding: '40px',
        borderRadius: '15px',
        backgroundColor: '#333',
        maxWidth: '600px', // Increased width
        width: '90%', // Increased to nearly full width of the screen
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.7)',
    },
    title: {
        fontSize: '3.5em',
        margin: '0 0 20px 0',
        color: '#f4f3ef',
        fontFamily: "Pixelify Sans",
        fontWeight: "700",
    },
    score: {
        fontFamily: "Pixelify Sans",
        fontWeight: "700",
        fontSize: '2.5em',
        marginBottom: '20px',
    }
};

export default EndScreen;
