package engr302S3.server.map;

import engr302S3.server.players.Developer;
import engr302S3.server.players.Player;
import engr302S3.server.ticketFactory.Task;
import engr302S3.server.ticketFactory.Ticket;
import engr302S3.server.ticketFactory.TicketFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

public class StationTests {
    private Board board;
    private Player player;
    private Ticket ticket;
    private Station station;

    @BeforeEach
    public void setUp() {
        board = Board.testingBoard();
        player = board.getPlayers().values().stream()
                .filter(p -> p instanceof Developer)
                .findFirst()
                .orElse(null);
        station = board.getStations().values().stream()
                .findFirst()
                .orElse(null);
        // Get a ticket that has a task for the above station
        do {
            ticket = TicketFactory.getTicket();
        } while (ticket.getTasks().stream().map(Task::getType).noneMatch(stationType -> stationType.equals(station.getStationType())));
        ticket.setTile(Optional.of(board.getTileAt(4, 3)));
        board.addTicket(ticket.getId(), ticket);
        board.pickUpTicket(player);
        board.movePlayer(player, Player.Direction.DOWN);
        board.dropTicket(player);
    }

    @Test
    public void testProgress() {
        station.progress();
        assertEquals(1, station.getProgress(), "Station progress should be 1 after one increment");
    }

    @Test
    public void testProgressCompletion() {
        Task task = station.getRelevantTask(ticket).get();

        // Simulate the completion of task
        for (int i = 0; i < task.getCompletionTimeTotal() - 1; i++) {
            station.progress();
            task.updateCompletion();
            assertFalse(task.getCompleted());
        }
        station.progress();
        task.updateCompletion();
        assertTrue(task.getCompleted());
    }

    @Test
    public void testGetRelevantTask() {
        Task task = station.getRelevantTask(ticket).get();
        assertEquals(station.getStationType(), task.getType());
        assertTrue(ticket.getTasks().contains(task));
    }

    private void testTicketDropOntoStation(int x, int y) {
        board.dropTicket(player);
        assertTrue(station.inUse());
        assertEquals(Optional.of(ticket), station.getTicketWorkingOn());
        assertTrue(ticket.getTile().isPresent());
        Tile tile = ticket.getTile().get();
        assertEquals(tile, board.getTileAt(x, y));
        assertEquals(tile.getType(), TileType.STATION_AND_TICKET);
    }

    @Test
    public void testTicketDropOntoStation() {
        testTicketDropOntoStation(3, 4);
    }

    @Test
    public void testTicketPickUpFromStation() {
        board.pickUpTicket(player);
        assertEquals(Optional.of(ticket), player.getHeldTicket());
        assertTrue(station.getTicketWorkingOn().isEmpty());
        assertFalse(station.inUse());
        for (Tile tile : station.getTiles()) {
            assertFalse(tile.containsTicket(), "Station tile should not have a ticket after pick up");
            assertTrue(tile.getType() == TileType.STATION || tile.getType() == TileType.STATION_AND_TICKET);
        }
    }

    @Test
    public void testPickUpAndDrop() {
        testTicketDropOntoStation(3, 4);
        testTicketPickUpFromStation();
        testTicketDropOntoStation();
        testTicketPickUpFromStation();
    }

    @Test
    public void testPickUpFromAnyTile() {
        testTicketDropOntoStation(3, 4);
        board.movePlayer(player, Player.Direction.LEFT);
        board.movePlayer(player, Player.Direction.LEFT);
        board.movePlayer(player, Player.Direction.DOWN);
        testTicketPickUpFromStation();
    }

    @Test
    public void testTicketDropOntoCompletionTile() {
        board.pickUpTicket(player);
        board.movePlayer(player, Player.Direction.RIGHT);
        board.movePlayer(player, Player.Direction.RIGHT);
        board.movePlayer(player, Player.Direction.DOWN);
        board.dropTicket(player);
        Tile tile = board.getTileAt(4, 4);
        assertEquals(tile.getType(), TileType.COMPLETION);
        Tile playerTile = player.getTile();
        board.movePlayer(player, Player.Direction.DOWN);
        assertEquals(playerTile, player.getTile());
    }

    @Test
    public void testTicketDropOntoWall() {
        board.pickUpTicket(player);
        board.movePlayer(player, Player.Direction.LEFT);
        board.movePlayer(player, Player.Direction.LEFT);
        board.movePlayer(player, Player.Direction.UP);
        board.dropTicket(player);
        assertTrue(ticket.getTile().isEmpty());
        assertEquals(Optional.of(ticket), player.getHeldTicket());
        assertEquals(board.getTileAt(2,2).getType(), TileType.WALL);
    }

    @Test
    public void testTicketDropOntoStationTwoAtATime() {
        board.movePlayer(player, Player.Direction.RIGHT);
        Ticket ticket2 = TicketFactory.getTicket();
        ticket2.setTile(Optional.of(board.getTileAt(4,3)));
        board.addTicket(ticket2.getId(), ticket2);
        board.pickUpTicket(player);
        board.movePlayer(player, Player.Direction.DOWN);
        board.dropTicket(player);
        assertEquals(Optional.of(ticket), station.getTicketWorkingOn());
        assertEquals(Optional.of(ticket2), player.getHeldTicket());
        assertEquals(ticket.getTile().get().getType(), TileType.STATION_AND_TICKET);
    }
}
