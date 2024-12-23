package engr302S3.server.map;

import engr302S3.server.players.Player;
import engr302S3.server.ticketFactory.Ticket;

import lombok.Getter;
import lombok.Setter;

/**
 * Game tiles in a devastation game
 */
@Getter
public class Tile {

    private final int x;
    private final int y;
    @Getter
    @Setter
    private TileType type;

    /**
     * Constructor to create a tile at the given position.
     * Initializes the tile as empty with no content.
     *
     * @param x The position of the tile (x coordinates).
     * @param y The position of the tile (y coordinates).
     */
    public Tile(int x, int y) {
        this.x = x;
        this.y = y;
        this.type = TileType.EMPTY;
    }

    /**
     * Constructor to create a tile at the given position.
     * Initializes the tile as empty with no content.
     *
     * @param x The position of the tile (x coordinates).
     * @param y The position of the tile (y coordinates).
     * @param type the type of tile to be constructed.
     */
    public Tile(int x, int y, TileType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    /**
     * Method to check if the tile is empty.
     *
     * @return {@code true} if the tile is empty, {@code false} otherwise.
     */
    public boolean empty() {
        return type == TileType.EMPTY;
    }

    /**
     * Method to check if the tile contains a ticket.
     *
     * @return {@code true} if the tiles contents are a ticket, {@code false} otherwise.
     */
    public boolean containsTicket() {
        return type == TileType.TICKET || type == TileType.STATION_AND_TICKET;
    }

    /**
     * Method to clear the tile, setting it back to empty with no content.
     */
    public void clearTile() {
        if (type == TileType.STATION_AND_TICKET) {
            type = TileType.STATION;
        } else {
            type = TileType.EMPTY;
        }
    }

    @Override
    public String toString() {
        return switch (type) {
            case STATION -> "_S_|";
            case PLAYER -> "_P_|";
            case TICKET -> "_T_|";
            case EMPTY -> "_*_|";
            case WALL -> "_W_|";
            case BOUNDARY -> "_B_|";
            case STATION_AND_TICKET -> "_ST_|";
            case BOUNDARY_AND_TICKET -> "_BT_|";
            case COMPLETION -> "_C_|";
        };
    }
}