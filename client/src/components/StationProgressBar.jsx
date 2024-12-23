import { Graphics, Text } from '@pixi/react';
import { useMemo } from 'react';
import {TILE_WIDTH} from "../js/spriteFrameGrabber.js";

const StationProgressBar = ({ stationProgress, stationName, mapDrawInfo, tileWidth }) => {
    // Hard-code x and y based on stationName
    const mapX = mapDrawInfo.x
    const mapY = mapDrawInfo.y

    let x = 100;
    let y = 100;

    switch (stationName) {
        case 'FRONTEND':
            x = mapX + (12 * tileWidth);
            y = mapY + (2 * tileWidth);
            break;
        case 'BACKEND':
            x = mapX + (14 * tileWidth);
            y = mapY + (10 * tileWidth);
            break;
        case 'API':
            x = mapX + (16 * tileWidth);
            y = mapY + (2 * tileWidth);
            break;
        case 'STATIC_ANALYSIS':
            x = mapX + (26 * tileWidth);
            y = mapY + (10 * tileWidth);
            break;
        case 'COVERAGE_TESTING':
            x = mapX + (24 * tileWidth);
            y = mapY + (2 * tileWidth);
            break;
        case 'UNIT_TESTING':
            x = mapX + (22 * tileWidth);
            y = mapY + (10 * tileWidth);
            break;
        default:
            x = 100;
            y = 100;
    }

    const width = 2 * tileWidth;  // Fixed full width of the progress bar
    const height = tileWidth/2;

    let fillColor = 0x3CB371;  // Green color for progress bar

    // Calculate the current width of the progress bar based on stationProgress (0 -> 1)
    const currentWidth = useMemo(() => stationProgress * (width - 4), [stationProgress, width]);

    return (
        <>
            {/* Conditional rendering based on stationProgress */}
            {stationProgress === 0 ? (
                // If stationProgress is 0, display "TASK COMPLETE"
                <Text
                    text="Task Complete"
                    x={x}
                    y={y}
                    style={{ fill: '#ffffff', fontSize: 24 }} // Example style
                    width={TILE_WIDTH*2}
                    height={TILE_WIDTH/2}
                />
            ) : (
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

                    {/* Dynamic progress bar that shrinks as stationProgress decreases */}
                    <Graphics
                        draw={g => {
                            g.clear();
                            g.beginFill(fillColor); // Green for the remaining progress
                            g.drawRect(x + 2, y + 2, currentWidth, height - 4); // Inset by 2px to fit inside the border
                            g.endFill();
                        }}
                    />
                </>
            )}
        </>
    );

};

export default StationProgressBar;
