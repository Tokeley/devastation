package engr302S3.server.ticketFactory;

import engr302S3.server.map.Tile;
import engr302S3.server.map.TileType;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Optional;

/**
 * Ticket contains a collection of tasks for the players to complete. Tickets keep track of how
 * long they have been active for the purpose of scoring.
 */
@Getter
public class Ticket {
    private static long idTracker = 1;
    private final long id;
    private final ArrayList<Task> tasks;
    private final String ticketTitle;
    private int totalTime;
    @Setter private Optional<Tile> tile;
    private final double blowOutProb;

    Ticket(String title, int totalTime, double blowOutProb, ArrayList<Task> tasks) {
        id = idTracker++;
        this.ticketTitle = title;
        this.totalTime = totalTime;
        this.blowOutProb = blowOutProb;
        this.tasks = tasks;
    }

    public boolean isInFinishZone(){
        if (tile.isPresent()){
            Tile ticketTile = tile.get();
            return ticketTile.getType() == TileType.COMPLETION;
        }
        return false;
    }

    /**
     * Increments time the Ticket has been active.
     */
    public void incrementTime() {
        totalTime++;
    }

    /**
     * Method to check if all tasks are completed and update ticket status
     * @return if all tasks completed
     */
    public boolean isComplete() {
      return tasks.stream().allMatch(Task::getCompleted);
    }
}