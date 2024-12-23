package engr302S3.server.players;

import engr302S3.server.map.Tile;

/**
 * Class for project manager player
 */
public class ProjectManager extends Player {

    public ProjectManager(Tile tile) {
        super(Role.PROJECT_MANAGER, tile);
    }
}