import { Graphics, Text } from '@pixi/react';
import {useMemo, useState} from 'react';

const TimerProgressBar = ({ timeLeft, progressBarDrawInfo }) => {
    const { x, y, width, height } = progressBarDrawInfo;
    const maxTime = 300; // Initial time value

    // Determine the color based on the time left
    let fillColor;
    if (timeLeft > maxTime / 2) {
        fillColor = 0x3CB371; // Medium Sea Green
    } else if (timeLeft > maxTime / 4) {
        fillColor = 0xFFD700; // Gold (Halfway)
    } else if (timeLeft > maxTime / 8) {
        fillColor = 0xFFA500; // Orange (Quarter)
    } else {
        fillColor = 0xFF4500; // Orange Red (Eighth)
    }

    // Calculate the current width of the progress bar based on timeLeft
    const currentWidth = useMemo(() => (timeLeft / maxTime) * (width - 4), [timeLeft, width]);

    return (
        <>
            {/* Progress bar with dark grey border */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.lineStyle(2, 0x333333); // Dark grey border, 2px thick
                    g.beginFill(0xCCCCCC); // Grey background
                    g.drawRect(x, y, width, height); // Full width background
                    g.endFill();
                }}
            />

            {/* Dynamic progress bar that shrinks as timeLeft decreases */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.beginFill(fillColor); // Green for the remaining time
                    g.drawRect(x + 2, y + 2, currentWidth, height - 4); // Inset by 2px to fit inside the border
                    g.endFill();
                }}
            />

            <Text
                text={`Time Left: ${timeLeft}s`}
                x={x + width / 2 - 50} // Center the text
                y={y + height + 10} // Position below the progress bar
                style={{
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fill: '#000000', // Black text
                    align: 'center'
                }}
            />
        </>
    );
};

export default TimerProgressBar;

