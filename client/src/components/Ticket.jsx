import { Sprite } from '@pixi/react';
import { TILE_WIDTH } from "../js/spriteFrameGrabber.js";

const Ticket = ({ ticket, mapPosition }) => {

    const ticketPositionX = mapPosition.x + ticket.x * TILE_WIDTH;
    const ticketPositionY = mapPosition.y + ticket.y * TILE_WIDTH;


    return (
        ticket.held
            ?
                < ></>
            :
                <Sprite
                    key={ticket.id}
                    image={'../../assets/ticket.png'}
                    x={ticketPositionX}
                    y={ticketPositionY}
                    width={TILE_WIDTH}
                    height={TILE_WIDTH}
                />
    );
};

export default Ticket;
