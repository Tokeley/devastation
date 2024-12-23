package engr302S3.server.map;

import engr302S3.server.players.Developer;
import engr302S3.server.players.Player;
import engr302S3.server.players.ProjectManager;
import engr302S3.server.players.Tester;
import engr302S3.server.ticketFactory.Ticket;

import lombok.Getter;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

@Getter
public class Board {

    public static int BOARD_WIDTH;
    public static int BOARD_HEIGHT;

    private final Tile[][] board;
    private final Map<Long, Player> players;
    private final Map<Long, Station> stations;
    private final Map<Long, Ticket> tickets;
    private final Map<Ticket, Tile> ticketTiles;
    private final ArrayList<Tile> boundaries;
    // A simple 6x6 map with one wall and one station tile
    private static final String mapData = """
                -1,-1,-1,-1,-1,-1
                -1,-1,-1,-1,-1,-1
                -1,-1,160,-1,-1,-1
                -1,-1,-1,-1,-1,-1
                -1,-1,33,33,101,-1
                -1,-1,33,33,-1,-1
                """;

    public Board() {
        this.boundaries = new ArrayList<>();
        this.board = createBoard("src/main/resources/map.csv");

        this.players = new HashMap<>();
        this.stations = new HashMap<>();
        this.tickets = new HashMap<>();
        this.ticketTiles = new HashMap<>();


        createPlayers();
        createStations();
    }

    /**
     * Loads the board from a CSV string
     * FOR TESTING PURPOSES ONLY
     */
    Board(String csvData) {
        this.boundaries = new ArrayList<>();
        this.board = createBoardFromCsv(csvData);

        this.players = new HashMap<>();
        this.stations = new HashMap<>();
        this.tickets = new HashMap<>();
        this.ticketTiles = new HashMap<>();

        createPlayers();
        createStations();
    }

    /**
     * Get a test board that has one station and
     * @return the test board
     */
    static Board testingBoard() {
        return new Board(mapData);
    }

    /**
     * For each value in the csv assign the type value corresponding to tile type
     *
     * @param path of csv
     * @return the board
     */
    public Tile[][] createBoard(String path) {
        ArrayList<String[]> map = load(path);

        return getTiles(map);
    }

    private Tile[][] getTiles(ArrayList<String[]> map) {
        BOARD_HEIGHT = map.size();
        BOARD_WIDTH = map.get(0).length;

        Tile[][] board = new Tile[BOARD_WIDTH][BOARD_HEIGHT];

        for (int x = 0; x < BOARD_WIDTH; x++) {
            for (int y = 0; y < BOARD_HEIGHT; y++) {
                board[x][y] = createTile(x, y, map.get(y)[x]);
            }
        }

        return board;
    }

    // Method to load a CSV file
    private ArrayList<String[]> load(String path) {
        ArrayList<String[]> lines = new ArrayList<>();

        try {
            File file = new File(path);
            Scanner scanner = new Scanner(file);

            while (scanner.hasNextLine()) {
                lines.add(scanner.nextLine().split(","));
            }

        } catch (FileNotFoundException e) {
            System.out.println("File not found");
        }

        return lines;
    }


    private Tile createTile(int x, int y, String code) {

        Tile tile;

        switch (code) {
            case "33" -> tile = new Tile(x, y, TileType.STATION);
            case "50" -> tile = new Tile(x, y, TileType.BOUNDARY);
            case "160" -> tile = new Tile(x, y, TileType.WALL);
            case "101" -> tile = new Tile(x, y, TileType.COMPLETION);
            default -> tile = new Tile(x, y);
        }

        if (tile.getType() == TileType.BOUNDARY) {
            boundaries.add(tile);
        }

        return tile;
    }

    /**
     * Set up the board with positions of developers.
     */
    private void createPlayers() {
        // Define player positions
        int shift = BOARD_WIDTH / 6;

        Tile projectManagerTile = board[shift][BOARD_HEIGHT / 2];
        Tile developerTile = board[shift * 3][BOARD_HEIGHT / 2];
        Tile testerTile = board[shift * 5][BOARD_HEIGHT / 2];

        projectManagerTile.setType(TileType.PLAYER);
        developerTile.setType(TileType.PLAYER);
        testerTile.setType(TileType.PLAYER);

        ProjectManager projectManager = new ProjectManager(projectManagerTile);
        Developer developer = new Developer(developerTile);
        Tester tester = new Tester(testerTile);

        // Add players to the players map
        this.players.put(projectManager.getId(), projectManager);
        this.players.put(developer.getId(), developer);
        this.players.put(tester.getId(), tester);
    }


    /**
     * Create stations in a 2x2 radius of a Station tile on the map.
     */
    public void createStations() {
        Set<Tile> finishedStations = new HashSet<>();
        StationType[] types = StationType.values();
        int typeIndex = 0;

        for (int x = 0; x < BOARD_WIDTH - 1; x++) {
            for (int y = 0; y < BOARD_HEIGHT - 1; y++) {
                Tile tile = board[x][y];
                if (tile.getType() == TileType.STATION && !finishedStations.contains(tile)) {
                    createStationCluster(x, y, types[typeIndex++ % types.length], finishedStations);
                }
            }
        }
    }

    /**
     * Creates a 2x2 station cluster starting from the top-left tile (x, y).
     */
    private void createStationCluster(int x, int y, StationType type, Set<Tile> finishedStations) {
        List<Tile> stationTiles = List.of(
                board[x][y], board[x][y + 1],
                board[x + 1][y], board[x + 1][y + 1]
        );

        Station station = new Station(type, stationTiles);
        stations.put(station.getId(), station);

        finishedStations.addAll(stationTiles); // Mark the 2x2 tiles as processed
    }

    /**
     * Pick up item on requested player
     *
     * @param player to requested to pick up item
     */
    public void pickUpTicket(Player player) { //This can be changed to string etc. or some other way to get players
        Tile tile = getTranslation(player.getTile(), player.getDirection());
        Optional<Ticket> ticketOptional = getTicketOnTile(tile);
        // No ticket to pick up
        if (ticketOptional.isEmpty()) {
            return;
        }
        Ticket ticket = ticketOptional.get();
        tile = ticket.getTile().get();
        // When picked up, set ticket position to none
        ticket.setTile(Optional.empty());
        player.setHeldTicket(Optional.ofNullable(ticket));

        Optional<Station> stationOptional = getStationOnTile(tile);
        // Set ticket station is working on if not in use
        if (stationOptional.isPresent()) {
            Station station = stationOptional.get();
            if (station.inUse()) {
                station.setTicketWorkingOn(Optional.empty()); // Set to empty Optional instead of ticket
            }
        }

        tile.clearTile();
    }

    /**
     * Drop currently held ticket of player, may change parameter to string for specific player
     */
    public Ticket dropTicket(Player player) {
        Tile tile;

        if (player.getHeldTicket().isEmpty()) {
            return null;
        }

        try {
            tile = getTranslation(player.getTile(), player.getDirection());
        } catch (IllegalArgumentException e) {
            return null; //Do nothing if the position is out of bounds
        }

        if (tile.getType() == TileType.TICKET || tile.getType() == TileType.WALL) {
            return null;
        }

        Optional<Station> stationOptional = getStationOnTile(tile);
        Ticket ticket = player.getHeldTicket().get();
        // Set ticket station is working on if not in use
        if (stationOptional.isPresent()) {
            Station station = stationOptional.get();
            if (station.inUse()) {
                return null;
            }
            station.setTicketWorkingOn(Optional.of(ticket));
        }

        TileType newType = switch (tile.getType()) {
            case STATION -> TileType.STATION_AND_TICKET;
            case BOUNDARY -> TileType.BOUNDARY_AND_TICKET;
            case COMPLETION -> TileType.COMPLETION;
            default -> TileType.TICKET;
        };
        ticket.setTile(Optional.of(tile));
        tile.setType(newType);
        player.setHeldTicket(Optional.empty());
        return ticket;
    }

    /**
     * Brute force all the tickets to find a ticket on the tile next to the player.
     * If the tile next to the player is a station, it will attempt to get the ticket from any of the tiles for that station.
     *
     * @param tile the tile desired
     * @return the ticket on the tile if there is one
     */
    private Optional<Ticket> getTicketOnTile(Tile tile) {
        if (tile.getType() == TileType.STATION || tile.getType() == TileType.STATION_AND_TICKET) {
            StationType stationType = getStationOnTile(tile).get().getStationType();
            return tickets.values().stream()
                    .filter(t -> t.getTile().isPresent() && getStationOnTile(t.getTile().get()).isPresent() && getStationOnTile(t.getTile().get()).get().getStationType().equals(stationType))
                    .findFirst();
        }
        return tickets.values().stream()
                .filter(t -> t.getTile().isPresent() && t.getTile().get().equals(tile))
                .findFirst();
    }

    /**
     * Brute force all the stations to find a station on the tile next to the player.
     *
     * @param tile the tile desired
     * @return the station on the tile if there is one
     */
    private Optional<Station> getStationOnTile(Tile tile) {
        return stations.values().stream()
                .filter(s -> s.getTiles().stream().anyMatch(t -> t.equals(tile)))
                .findFirst();
    }

    public void movePlayer(Player player, Player.Direction direction) {
        Tile currentTile = player.getTile();
        Tile targetTile;

        //turn the player, don't move him
        if(direction != player.getDirection()){
            player.setDirection(direction);
            return;
        }

        // Determine target tile based on direction
        targetTile = getTranslation(currentTile, direction);

        if (boundaries.contains(targetTile)) {
            return;
        }

        if (!targetTile.empty()) return;

        // Update player's tile to new tile
        player.setTile(targetTile);
        currentTile.clearTile();
    }

    private Tile getTranslation(Tile tile, Player.Direction direction) {
        try{
            return switch (direction) {
                case LEFT -> board[tile.getX() - 1][tile.getY()];
                case UP -> board[tile.getX()][tile.getY() - 1];
                case DOWN -> board[tile.getX()][tile.getY() + 1];
                case RIGHT -> board[tile.getX() + 1][tile.getY()];
            };
        } catch (ArrayIndexOutOfBoundsException b){
            return null;
        }
    }

    /**
     * Add a ticket to the board
     *
     * @param id     the ticket ID
     * @param ticket the ticket Object
     */
    public void addTicket(long id, Ticket ticket) {
        if (ticket.getTile().isPresent()) {
            Tile t = ticket.getTile().get();
            if (t.empty()) {
                tickets.put(id, ticket);
            }
        }
    }


    // Method to create a board from a CSV string
    public Tile[][] createBoardFromCsv(String csvData) {
        ArrayList<String[]> lines = new ArrayList<>();
        Scanner scanner = new Scanner(csvData);

        while (scanner.hasNextLine()) {
            lines.add(scanner.nextLine().split(","));
        }

        // Reuse the same board generation logic for CSV string data
        return combineBoardData(lines); // You can customize stations vs. walls here if needed
    }

    // Helper method to combine data and generate the board
    private Tile[][] combineBoardData(ArrayList<String[]> lines) {
        return getTiles(lines);
    }


    /**
     * Method to retrieve a specific tile at the given coordinates.
     *
     * @param x The position of the tile (x coordinates).
     * @param y The position of the tile (y coordinates).
     * @return The tile at the given coordinates
     */
    public Tile getTileAt(int x, int y) {
        return board[x][y];
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        sb.append("_____".repeat(BOARD_WIDTH)).append("\n");

        for (int y = 0; y < BOARD_HEIGHT; y++) {
            sb.append("|");
            for (int x = 0; x < BOARD_WIDTH; x++) {
                sb.append(board[x][y].toString());
            }
            sb.append("|\n");
        }

        sb.append("‾‾‾‾‾".repeat(BOARD_WIDTH));

        return sb.toString();
    }
}