package engr302S3.server.map;

/**
 * Enum representing the possible types of content that a tile can hold.
 */
public enum TileType {
    EMPTY,
    STATION,
    PLAYER,
    TICKET,
    WALL,
    BOUNDARY,
    STATION_AND_TICKET,
    BOUNDARY_AND_TICKET,
    COMPLETION
}