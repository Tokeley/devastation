package engr302S3.server.playerActions;

import engr302S3.server.map.StationType;
import engr302S3.server.ticketFactory.Ticket;

public record TaskProgressBroadcast(Ticket ticket, StationType stationType) {}