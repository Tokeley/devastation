package engr302S3.server.players;

import engr302S3.server.ticketFactory.Ticket;
import engr302S3.server.map.Tile;

import lombok.Getter;
import lombok.Setter;

import java.util.Optional;

/**
 * Abstract class representing players
 */
@Getter @Setter
public abstract class Player {

    /**
     * Possible roles
     */
    public enum Role {
        PROJECT_MANAGER,
        DEVELOPER,
        TESTER
    }

    /**
     * Player movement directions
     */
    public enum Direction {
        UP,
        DOWN,
        LEFT,
        RIGHT
    }

    private static long idTracker = 1;
    private final long id;
    private final Role role;
    private Tile tile;
    private Direction direction;
    private boolean active;
    private Optional<Ticket> heldTicket; //setter doubles as pickup (no conditions needed)

    /**
     * Player Constructor
     *
     * @param role of the player
     * @param tile of the player initially
     */
    public Player(Role role, Tile tile) {
        this.id = idTracker++;
        this.role = role;
        this.tile = tile;
        this.direction = Direction.RIGHT;
        this.active = false;
        this.heldTicket = Optional.empty();
    }

    @Override
    public String toString() {
        return "Player role: " + role + ", Position: (" + tile.getX() + ", " + tile.getY() + "), Active: " + active;
    }
}