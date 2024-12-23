package engr302S3.server.ticketFactory;

import engr302S3.server.map.StationType;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * Responsible for generating Tickets and their associated Tasks
 */
public class TicketFactory {

    private static final Random random = new Random();
    private static final String[] ticketNames = new String[]{
            "Bug Bash: Error Hunt",
            "Refactor the Spaghetti",
            "Optimize Algorithm Efficiency",
            "Database Query Overhaul",
            "UI Component Cleanup",
            "API Endpoint Enhancement",
            "Code Coverage Expansion",
            "Script Performance Tuning",
            "Dependency Version Upgrade",
            "Security Vulnerability Patch"
    };

    public static Ticket getTicket(){
        ArrayList<Task> tasks = createTasks();
        return new Ticket(generateTitle(), tasks.stream().map(Task::getCompletionTime).reduce(Integer::sum).orElseThrow(), generateBlowOutProb(tasks), tasks);
    }

    /**
     * Choose a random ticket name
     * @return ticketName
     */
    private static String generateTitle(){
        return ticketNames[random.nextInt(ticketNames.length)];
    }

    /**
     * Generate a double that represents how likely a ticket will blow out into multiple new tickets.
     * Currently, the double represent a percentage, but can change to be decimal
     * @return double
     */
    private static int generateBlowOutProb(ArrayList<Task> tasks){
        return (100 / ticketNames.length) * tasks.size(); //blowout probability increases the amount of tasks in ticket
    }

    /**
     * Generate a random arraylist of tasks
     * Minimum amount is one task for developer
     * Maximum amount is three tasks for developer and three tasks for tester
     * @return ArrayList
     */
    private static ArrayList<Task> createTasks() {

        ArrayList<Task> tasks = new ArrayList<>();

        int numStationTypesLeft = StationType.values().length;

        //split stations by their designated rooms to make them easier to pick and choose depending on the generated random integer value
        List<StationType> stations = new ArrayList<>(List.of(StationType.values()));
        List<StationType> devStations = stations
                .stream()
                .filter(StationType::isDeveloper)
                .collect(Collectors.toCollection(ArrayList::new));

        StationType station = devStations.get(random.nextInt(devStations.size())); //there should always be at least one dev room task, so add a random dev station task first
        tasks.add(new Task(station));
        stations.remove(station);
        numStationTypesLeft--;

        for (int i = 0; i < random.nextInt(StationType.values().length); i++) {
            station = stations.get(--numStationTypesLeft);
            tasks.add(new Task(station));
            stations.remove(station);
        }

        return tasks;
    }
}