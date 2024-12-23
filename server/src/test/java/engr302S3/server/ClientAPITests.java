package engr302S3.server;

import engr302S3.server.map.Tile;
import engr302S3.server.map.TileType;
import engr302S3.server.playerActions.*;
import engr302S3.server.players.Player;
import engr302S3.server.ticketFactory.Ticket;
import engr302S3.server.ticketFactory.TicketFactory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Comparator;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class ClientAPITests {
    private Devastation devastation;
    private ClientAPI api;
    private Player player;
    private Tile initialTile;

    @BeforeEach
    public void setUp() {
        devastation = new Devastation();
        api = new ClientAPI(devastation);
        player = devastation.getBoard().getPlayers().values().stream().min(Comparator.comparing(Player::getId)).get();
        player.setActive(true);
        initialTile = player.getTile();
    }

    @Test
    public void testMovePlayer_changeDirection() {
        assertFalse(initialTile.empty());
        api.movePlayer(new Movement(player.getId(), Player.Direction.DOWN));
        Tile newTile = player.getTile();
        assertEquals(this.initialTile, newTile);
        assertEquals(Player.Direction.DOWN, player.getDirection());
    }

    @Test
    public void testMovePlayer_moveDown() {
        api.movePlayer(new Movement(player.getId(), Player.Direction.DOWN));
        api.movePlayer(new Movement(player.getId(), Player.Direction.DOWN));
        Tile newTile = player.getTile();
        assertEquals(initialTile.getX(), newTile.getX());
        assertEquals(initialTile.getY() + 1, newTile.getY());
        assertEquals(Player.Direction.DOWN, player.getDirection());
    }

    @Test
    public void testMovePlayer_moveUp() {
        api.movePlayer(new Movement(player.getId(), Player.Direction.DOWN));
        api.movePlayer(new Movement(player.getId(), Player.Direction.DOWN));
        api.movePlayer(new Movement(player.getId(), Player.Direction.UP));
        api.movePlayer(new Movement(player.getId(), Player.Direction.UP));
        Tile newTile = player.getTile();
        assertEquals(initialTile, newTile);
        assertEquals(Player.Direction.UP, player.getDirection());
    }

    @Test
    public void testMovePlayer_moveRight() {
        api.movePlayer(new Movement(player.getId(), Player.Direction.RIGHT));
        Tile newTile = player.getTile();
        assertEquals(initialTile.getX() + 1, newTile.getX());
        assertEquals(initialTile.getY(), newTile.getY());
        assertEquals(Player.Direction.RIGHT, player.getDirection());
    }

    @Test
    public void testMovePlayer_moveLeft() {
        api.movePlayer(new Movement(player.getId(), Player.Direction.RIGHT));
        api.movePlayer(new Movement(player.getId(), Player.Direction.LEFT));
        api.movePlayer(new Movement(player.getId(), Player.Direction.LEFT));
        Tile newTile = player.getTile();
        assertEquals(initialTile, newTile);
        assertEquals(Player.Direction.LEFT, player.getDirection());
    }

    @Test
    public void testActivatePlayer_activate() {
        api.activatePlayer(new Activation(player.getId(), true));
        assertTrue(player.isActive());
    }

    @Test
    public void testActivatePlayer_deactivate() {
        api.activatePlayer(new Activation(player.getId(), false));
        assertFalse(player.isActive());
    }
}