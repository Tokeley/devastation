package engr302S3.server.players;

import engr302S3.server.map.Tile;

/**
 * Class for developer player
 */
public class Developer extends Techie {

    public Developer(Tile tile) {
        super(Role.DEVELOPER, tile);
    }
}