import { Graphics, Text } from '@pixi/react';
import { useMemo } from 'react';

const ScoreBoard = ({ score, scoreBoardDrawInfo }) => {
    const { x, y, width, height } = scoreBoardDrawInfo;

    // Memoizing styles for better performance
    const backgroundColor = 0xd3d3d3; // Light grey
    const borderColor = 0x555555; // Dark grey
    const scoreTextColor = 0x555555; // Gold for score
    const labelTextColor = 0x000000; // Black for label
    const scoreFontSize = 65; // Larger font size for score
    const labelFontSize = 18; // Smaller font size for label

    return (
        <>
            {/* Background Rectangle */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.beginFill(backgroundColor);
                    g.drawRect(x, y, width, height);
                    g.endFill();
                }}
            />
            {/* Border Rectangle */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.lineStyle(2, borderColor);
                    g.drawRect(x, y, width, height);
                }}
            />
            {/* Label Text */}
            <Text
                text="Score"
                x={x + width / 2}
                y={y + 10} // Position above the score
                anchor={0.5} // Center the label text
                style={{
                    fontSize: labelFontSize,
                    fill: labelTextColor,
                    fontFamily: 'Courier New, monospace',
                    align: 'center',
                }}
            />
            {/* Score Text */}
            <Text
                text={`${score}`}
                x={x + width / 2}
                y={y + height / 2}
                anchor={0.5} // Center the score text
                style={{
                    fontSize: scoreFontSize,
                    fill: scoreTextColor,
                    fontFamily: 'Courier New, monospace',
                    align: 'center',
                }}
            />
        </>
    );
};

export default ScoreBoard;

