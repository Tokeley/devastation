package engr302S3.server;

import ch.qos.logback.core.net.server.Client;
import engr302S3.server.map.*;
import engr302S3.server.playerActions.TaskProgressBroadcast;
import engr302S3.server.ticketFactory.Task;
import engr302S3.server.ticketFactory.Ticket;
import engr302S3.server.ticketFactory.TicketFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Class responsible for ensuring any objects that rely on time get updated accordingly.
 */
@Component
public class ScheduledTasks {
    private final ClientAPI clientAPI;

    /**
     * Injects the ClientAPI Controller into this component
     *
     */
    @Autowired
    public ScheduledTasks(ClientAPI clientAPI) {
        this.clientAPI = clientAPI;
    }

    /**
     * For every 1000 milliseconds that elapses, ensure that Spring Boot updates the game time,
     * Ticket age, and Task completion
     */
    @Scheduled(fixedRate = 1000)
    public void updateGameTime() {
        if (!clientAPI.getDevastation().isRunning()) return;
        //update the game clock
        clientAPI.broadcastTimerUpdate(clientAPI.getDevastation().decreaseTime());
        if (clientAPI.getDevastation().isFinished()) {
            clientAPI.broadcastGameCompleted();
            clientAPI.getDevastation().setRunning(false);
            return;
        }
        //check each tile for a ticket, and update the ticket timer if there is one
        for (Ticket ticket : clientAPI.getDevastation().getBoard().getTickets().values()) {
            ticket.incrementTime();
        }
        //update the stations and tasks that they are working on
        for (Station station : clientAPI.getDevastation().getBoard().getStations().values()) {
            if (station.getTicketWorkingOn().isPresent()){
                clientAPI.broadcastTaskCompletion(new TaskProgressBroadcast(station.getTicketWorkingOn().get(), station.getStationType()));
                Ticket processingTicket = station.getTicketWorkingOn().get();
                for (Task task : processingTicket.getTasks()){
                    if (task.getType() == station.getStationType()){
                        task.updateCompletion();
                    }
                }
            }

            station.progress();
        }
    }

    /**
     * Every 5second try to generate a new ticket if there is room on the board
     */
    @Scheduled(fixedRate = 5000)
    public void createTicket(){
        if (!clientAPI.getDevastation().isRunning()) return;
        double spawnChance = 0.5; // 50% chance to spawn a ticket
        // if there are tickets on the board roll to see if another ticket will spawn
        if (!clientAPI.getDevastation().getBoard().getTickets().isEmpty()) {
            if (Math.random() < spawnChance) {
                spawnTicket();
            }
        }
        else{ // if there are no tickets on the board then always spawn a ticket
            spawnTicket();
        }
    }
    private void spawnTicket() {
        // Generate random x and y coordinates within the project manager area
        int randomX = 1 + (int) (Math.random() * 8);
        int randomY = 1 + (int) (Math.random() * 13);

        // Get the tile at the random position
        Tile tile = clientAPI.getDevastation().getBoard().getTileAt(randomX, randomY);
        if (!tile.empty()) {
            System.out.println("Tile at (" + randomX + ", " + randomY + ") is not empty. Ticket not created.");
            return;
        }
        Ticket ticket = TicketFactory.getTicket();
        ticket.setTile(Optional.ofNullable(tile));
        clientAPI.getDevastation().getBoard().addTicket(ticket.getId(), ticket);
        tile.setType(TileType.TICKET);
        clientAPI.broadcastTicketCreate(ticket);
    }
}