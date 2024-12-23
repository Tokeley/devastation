package engr302S3.server.players;

import engr302S3.server.map.Tile;

/**
 * Class for Tester player
 */
public class Tester extends Techie {

    public Tester(Tile tile) {
        super(Role.TESTER, tile);
    }
}