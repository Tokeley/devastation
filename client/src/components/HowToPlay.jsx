import { useState } from "react";
import { Container, Graphics, Text, Sprite } from "@pixi/react";
import devastaion from '../../assets/howToPlay/devaStationGame.png';
import aim from '../../assets/howToPlay/gameAim.png';
import developer from '../../assets/howToPlay/developer.png';
import projectManager from '../../assets/howToPlay/projectManager.png';
import stations from '../../assets/howToPlay/stations.png';
import tester from '../../assets/howToPlay/tester.png';
import ticketImage from '../../assets/howToPlay/ticket.png';

const HowToPlay = ({ setShow }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const pageMappings = [
        { title: "Welcome to Dev-A-Station!", text: "Welcome to devastation where you will learn the importance of working together, or suffer!", image: devastaion },
        { title: "Aim of the game", text: "The aim of the game is simple! Work together, get ticket tasks done and submit them!", image: aim },
        { title: "Tickets", text: "Tickets are items you’ll see spawning on the ground. Pick up a ticket to see its tasks and the time required for each.", image: ticketImage },
        { title: "Stations", text: "Stations are where you complete tasks. Drop a ticket on a station to start working on its tasks!", image: stations },
        { title: "Role: Project Manager", text: "As Project Manager, balance ticket loads between developers and testers to keep workflow smooth!", image: projectManager },
        { title: "Role: Developer", text: "Developers keep tickets moving by completing tasks and passing them on to testers!", image: developer },
        { title: "Role: Tester", text: "As the final stage, testers complete the ticket tasks and submit them to earn points!", image: tester },
    ];

    const goBack = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const goForward = () => {
        if (currentPage < pageMappings.length - 1) setCurrentPage(currentPage + 1);
    };

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    return (
        <Container>
            {/* Dimmed background */}
            <Graphics
                draw={(g) => {
                    g.clear();
                    g.beginFill(0x000000, 0.7); // Black with 70% opacity
                    g.drawRect(0, 0, screenWidth, screenHeight);
                    g.endFill();
                }}
                interactive={true}
                pointerdown={() => setShow(false)}
            />

            {/* Main HowToPlay Container */}
            <Container x={screenWidth / 2} y={screenHeight / 2} anchor={0.5}>

                {/* Left Text Box with Rounded Corners */}
                <Graphics
                    draw={(g) => {
                        g.clear();
                        g.beginFill(0xadd8e6);
                        g.drawRoundedRect(-800, -240, 700, 600, 40);
                        g.endFill();
                    }}
                />
                <Text
                    text={pageMappings[currentPage].text}
                    anchor={0.5}
                    x={-450}
                    y={40}
                    style={{
                        fontSize: 36,
                        fill: "#494949",
                        fontFamily: "Pixelify Sans",
                        fontWeight: "300",
                        wordWrap: true,
                        wordWrapWidth: 640,
                        align: "center",
                    }}
                />

                <Graphics
                    draw={(g) => {
                        g.clear();
                        g.beginFill(0xadd8e6);
                        g.drawRoundedRect(100, -240, 790, 600, 40);
                        g.endFill();
                    }}
                />

                <Text
                    text={pageMappings[currentPage].title}
                    anchor={0.5}
                    x={500}
                    y={-200}
                    style={{
                        fontSize: 48,
                        fill: "#545454",
                        fontFamily: "Pixelify Sans",
                        fontWeight: "700",
                    }}
                />
                <Sprite
                    image={pageMappings[currentPage].image}
                    x={500}
                    y={100}
                    width={700}
                    height={400}
                    anchor={0.5}
                    roundPixels={true}
                />

                {/* Navigation Buttons */}
                <Text
                    text="<"
                    interactive={true}
                    pointerdown={goBack}
                    anchor={0.5}
                    x={-screenWidth * 0.4}
                    y={0}
                    style={{ fontSize: 60, fill: "white", cursor: "pointer" }}
                />
                <Text
                    text=">"
                    interactive={true}
                    pointerdown={goForward}
                    anchor={0.5}
                    x={screenWidth * 0.4}
                    y={0}
                    style={{ fontSize: 60, fill: "white", cursor: "pointer" }}
                />

                {/* Current Page Indicator */}
                <Text
                    text={`Page ${currentPage + 1} of ${pageMappings.length}`}
                    style={{ fontSize: 32, fill: "#f6f6f6", fontFamily: "Pixelify Sans", fontWeight: "700" }}
                    x={0}
                    y={460}
                    anchor={0.5}
                />
            </Container>
        </Container>
    );
};

export default HowToPlay;
