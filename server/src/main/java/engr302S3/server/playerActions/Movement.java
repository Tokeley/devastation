package engr302S3.server.playerActions;

import engr302S3.server.players.Player;

public record Movement(long playerId, Player.Direction direction) {}