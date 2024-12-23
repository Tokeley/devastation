import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { localHeldTicket } from "../js/atoms.js";
import { useEffect } from "react";
import {useAtomValue} from "jotai";

const textStyle = (fontSize) => new TextStyle({
    fontFamily: 'Courier New, monospace',
    fontSize,
    fill: '#36454F',
    letterSpacing: 2 - (fontSize / 25), // Adjust letter spacing based on font size
    resolution: 1,
    padding: fontSize / 5,
});

const HeldTicket = ({ heldTicketDrawInfo, heldTicket }) => {
    const { x, y, width, height } = heldTicketDrawInfo;

    return (
        <Container position={[x, y]}>
            {heldTicket ? (
                <>
                    <Graphics draw={g => {
                        g.clear();
                        g.lineStyle(2, 0x555555);
                        g.beginFill(0xe4d5b7);
                        g.drawRect(0, 0, width, height); // Use width and height for the rectangle
                        g.endFill();
                    }} />

                    <Text text={`Ticket ${heldTicket.id}`} style={textStyle(25)} x={20} y={20} />
                    <Text text={heldTicket.ticketTitle} style={textStyle(21)} x={30} y={50} />

                    {heldTicket.tasks.map((task, index) => (
                        <Text
                            key={task.title}
                            text={task.completionTime === 0 ? `${task.title}  ✔️` : `${task.title}  ${task.completionTime}s`}
                            style={textStyle(20)}
                            x={40}
                            y={80 + index * 30}
                        />
                    ))}
                </>
            ) : null}
        </Container>
    );
};

export default HeldTicket;


