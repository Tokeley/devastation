package engr302S3.server;

import engr302S3.server.map.Board;
import engr302S3.server.map.StationType;
import engr302S3.server.players.Player;
import engr302S3.server.ticketFactory.Ticket;
import engr302S3.server.ticketFactory.TicketFactory;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ServerApplicationTests {

    @Test
    public void testPrintBoard() {
        File file = new File("src/main/resources/map.csv");

        try {
            Scanner scanner = new Scanner(file);

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                System.out.println(line);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            fail("File not found: " + e.getMessage());
        }

        Devastation devastation = new Devastation();

        System.out.println("-------------------------------------------------------------------------------------------------------------------------------");
        System.out.println(devastation.getBoard());
    }

    @Test
    public void testTicketFactory() {
        List<Ticket> tickets = new ArrayList<>();

        for (int i = 0; i < 500; i++) {
            tickets.add(TicketFactory.getTicket());
        }

        tickets.forEach(e -> System.out.println(e.getTasks().size()));

        assertTrue(tickets.stream().anyMatch(e -> e.getTasks().size() == 1),
                "There should be at least one ticket with exactly 1 task");
        assertTrue(tickets.stream().anyMatch(e -> e.getTasks().size() == StationType.values().length),
                "There should be at least one ticket with a number of tasks equal to the number of StationType values");
    }

    @Test
    public void testMovementBelowZero() {
        Devastation devastation = new Devastation();
        Board board = devastation.getBoard();
        long key = board.getPlayers().keySet().stream().sorted().findFirst().get();
        Player player = board.getPlayers().get(key);

        for (int i = 0; i < 50; i++) {
            board.movePlayer(player, Player.Direction.LEFT);
        }

        System.out.print(player.getTile());
        assertTrue(player.getTile().getX() >= 0 && player.getTile().getY() >= 0,
                "Player position should not be below zero after multiple movements");
    }

}