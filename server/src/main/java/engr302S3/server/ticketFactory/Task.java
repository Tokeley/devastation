package engr302S3.server.ticketFactory;

import engr302S3.server.map.StationType;

import lombok.Getter;
import lombok.Setter;

import java.util.Random;

/**
 * Tasks are the different objectives that must be completed within a ticket.
 * NOTE: May be re-designed to be a subclass of Ticket at a later date.
 */
@Getter
public class Task {

    private static final int MIN_TIME = 2;
    private static final int MAX_TIME = 11;
    private final Random random = new Random();
    private final String title;
    @Getter
    private final StationType type;
    private int completionTime = random.nextInt(MIN_TIME, MAX_TIME);
    @Getter
    private final int completionTimeTotal;
    @Getter private Boolean completed = false;

    public Task(StationType type) {
        this.title = type.toString();
        this.type = type;
        this.completionTimeTotal = completionTime;
    }

    /**
     * Reduce the time to completion, which should occur while this task is being worked at the relevant station
     */
    public void updateCompletion() {
        if (completed) {
            return;
        }

        completionTime--;

        if (completionTime <= 0) {
            completed = true;
        }
    }
}