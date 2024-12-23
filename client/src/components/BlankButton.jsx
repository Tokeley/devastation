import { Text, Container, Graphics } from "@pixi/react";

/**
 *
 * @param {string} text
 * @param {string} size - "small" || "medium" || "large"
 * @param {function} action - callback on what to do
 * @param {number} x - X position of the button
 * @param {number} y - Y position of the button
 * @param {boolean} active - Is the button active?
 * @returns {JSX.Element}
 * @constructor
 */
const BlankButton = ({ text, size, action, x, y, active = true }) => {

    // Determine font size based on the `size` prop
    const fontSizeMap = {
        small: 25,
        medium: 35,
        large: 45,
    };
    const fontSize = fontSizeMap[size] || fontSizeMap["medium"]; // Default to medium if size is invalid

    const buttonWidth = 400;  // Fixed width for the button
    const buttonHeight = 60;  // Fixed height for the button
    const borderWidth = 8;    // Thickness of the border
    const backgroundColor = "DA8E15"; // Button background color (hex)
    const borderColor = "4E211A"; // Button border color (white)

    return (
        <Container anchor={0.5} x={x} y={y} interactive={true} buttonMode={true} pointerdown={active && action}>
            {/* Button Background with Border */}
            <Graphics
                draw={(g) => {
                    g.clear();
                    // Draw border
                    g.beginFill(borderColor);
                    g.drawRect(-borderWidth, -borderWidth, buttonWidth + borderWidth * 2, buttonHeight + borderWidth * 2);
                    g.endFill();

                    // Draw button background
                    g.beginFill(backgroundColor);
                    g.drawRect(0, 0, buttonWidth, buttonHeight);
                    g.endFill();
                }}
            />

            <Text
                text={text}
                style={{
                    fontFamily: "Pixelify Sans",
                    fontWeight: "700",
                    fontSize: fontSize,
                    fill: active ? 0xFFFFFF : 0xAAAAAA,
                    align: 'center',
                }}
                anchor={0.5}
                x={buttonWidth / 2}
                y={buttonHeight / 2}
            />
        </Container>
    );
};

export default BlankButton;
