package engr302S3.server.map;

/**
 * Enum representing the different types of Stations, categorised into Tester and Developer.
 */
public enum StationType {
    FRONTEND(Room.DEVELOPER),
    BACKEND(Room.DEVELOPER),
    API(Room.DEVELOPER),
    UNIT_TESTING(Room.TESTER),
    COVERAGE_TESTING(Room.TESTER),
    STATIC_ANALYSIS(Room.TESTER);

    private final Room room; //Enum to represent the room of the role.

    /**
     * Constructor to associate a role with a room.
     *
     * @param room The room to which the Station belongs.
     */
    StationType(Room room) {
        this.room = room;
    }

    /**
     * Checks if the role belongs to the Tester room.
     *
     * @return {@code true} if the role is in the Tester room, {@code false} otherwise.
     */
    public boolean isTester() {
        return this.room == Room.TESTER;
    }

    /**
     * Checks if the role belongs to the Developer room.
     *
     * @return {@code true} if the role is in the Developer room, {@code false} otherwise.
     */
    public boolean isDeveloper() {
        return this.room == Room.DEVELOPER;
    }

    /**
     * Enum representing the rooms a role can belong to.
     */
    private enum Room {
        TESTER,
        DEVELOPER
    }
}