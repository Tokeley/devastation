# RUNNING.md

## Before Running

Before you can run the client or server, make sure you have the following dependencies installed:

| Dependency | Description                                     |
|------------|-------------------------------------------------|
| **Maven**  | Required for running the backend (server).      |
| **Yarn**   | Used on the client side and for launch scripts. |
| **Node**   | Used on the client side for running scripts.    |

## Set the server url in .env
1. Create a .env file in the /client directory
2. Add VITE_WEBSOCKET_URL=[add here] to this file
3. If you are running server locally use `ws://localhost:8080/stomp-endpoint`
4. If you are connecting to the server running on our ec2 instance use `ws://ec2-13-54-185-6.ap-southeast-2.compute.amazonaws.com:8080/stomp-endpoint`
## How to run the server on ec2
1. Log in to AWS with:
   - email: alex.t.manning@gmail.com
   - password: ask alex
2. Switch region to sydney (top right hand corner of console)
2. Go to instances and run `DevastationServer` if it is not already running
3. Get key off alex
4. Run `chmod 400 "S3Key.pem`
5. Connect with `ec2-54-206-219-25.ap-southeast-2.compute.amazonaws.com`
6. Once in the ssh run `cd engr302-project/server/`
7. Run `mvn clean install`
8. Run `mvn spring-boot:run`

## How to run the server locally 
1. Navigate to the server/ directory:

```cd server```

**First time run:** `mvn clean install`
2. Run the Spring Boot server:

```mvn spring-boot:run```

The server will start on http://localhost:8080.

# how to run the client
1. Navigate to the client/ directory:

```cd client```
2. Run the development server:

**First time running** ```yarn install```

```yarn run dev```

The client will be available at http://localhost:3000.

### How to Run Both Client and Server (must have dependencies installed)

To run both the client and server simultaneously, you can either open two separate terminal windows and follow the instructions, or use the provided script in the `package.json`
From the project root directory, simply run:

```yarn run start-all```

This will start both the client and server in parallel:

Client: http://localhost:5173
Server: http://localhost:8080