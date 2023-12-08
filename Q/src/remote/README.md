## REMOTE
This directory contains code related to running the Q Game over a network.

It contains 
- `connection.ts`, which abstracts the functionality of a TCP connection
  into a `Connection` class. It is used by both the server and the client to
  communicate with each other.
- `debugLog.ts`, which is a utility for optionally logging debug messages,
  depending on the value of `verbose` passed to its construction.

### Server

This directory contains code that is run on the server side of the networked game.

It contains:
- `server.ts`, which is the entry point for the server. It is
responsible for starting the server, waiting for clients to connect, and then
starting the game.
- `playerProxy.ts`, which contains a `TCPPlayer` which
  implements the player interface. It allows the referee to interact with the
  players controlled by clients as it would normally, because `TCPPlayer`
  translates those method calls into messages sent over the network.

#### Server Behavior
```mermaid
graph TB
  A[Create TCP Server and Wait for Players to Connect] -- On connection --> B[Create TCPConnection and TCPPlayer]
  A -- Once at least one player has connected --> C[Start Wait Period Timer]
  C --> D[Wait for Additional Players to Connect]
  D --> E[At Maximum Number of Players?]
  E -- Yes --> F[Start the Game]
  E -- No --> G[Check if Wait Period Exceeded Maximum]
  G -- No --> D
  G -- Yes --> I[Minumum Number of Players?]
  I -- Yes --> F
  I -- No --> J[Exceeded Maximum Wait Number of Wait Periods?]
  J -- No --> D
  J -- Yes --> K[Do not Run the Game and Return Empty Result]
  F --> H[Return Game Result]
```

### Client

This directory contains code that is run on the client side of the networked game.

It contains:
- `client.ts`, which is the entry point for the client. It
  is responsible for creating players, connecting to the server, and then
  starting referee proxies for each player.
- `refereeProxy.ts`, which contains a referee proxy function
  which handles messages from the server and translates them into method calls
  to be made on a local client player instance. 


## Sequence Diagram for Running a Distributed Game
```mermaid
sequenceDiagram
    participant Server
    participant Referee
    participant PlayerProxy_1
    participant Player_1
    participant PlayerProxy_n
    participant Player_n
    participant Client

    Client->>Player_1: instantiate()
    Client->>Player_n: instantiate()
    Client->>Server: connects players 1 through n
    
    Server->>PlayerProxy_1: name()
    PlayerProxy_1->>Player_1: message[name()]
    Player_1-->>PlayerProxy_1: message[response[name]]
    PlayerProxy_1-->>Server: response[name]

    Server->>PlayerProxy_n: name()
    PlayerProxy_n->>Player_n: message[name()]
    Player_n-->>PlayerProxy_n: message[response[name]]
    PlayerProxy_n-->>Server: response[name]

    alt at least two players have successfully signed up and the wait period has finished

      Server->>Referee: Referee(PlayerProxy_1 ... PlayerProxy_n) 

        loop while game is not over
            Referee->>PlayerProxy_1: takeTurn()
            PlayerProxy_1->>Player_1: message[takeTurn()]
            Player_1-->>PlayerProxy_1: message[response[turn]]
            PlayerProxy_1-->>Referee: response[turn]

            Referee->>PlayerProxy_n: takeTurn()
            PlayerProxy_n->>Player_n: message[takeTurn()]
            Player_n-->>PlayerProxy_n: message[response[turn]]
            PlayerProxy_n-->>Referee: response[turn]
            

            alt if player placed or exchanged tiles
                Referee->>PlayerProxy_1: newTiles()
                PlayerProxy_1->>Player_1: message[newTiles()]
                Player_1-->>PlayerProxy_1: message[ack[newTiles()]]

                Referee->>PlayerProxy_n: newTiles()
                PlayerProxy_n->>Player_n: message[newTiles()]
                Player_n-->>PlayerProxy_n: message[ack[newTiles()]]
            end

        end 

        Referee->>PlayerProxy_1: win()
        PlayerProxy_1->>Player_1: message[win()]
        Player_1-->>PlayerProxy_1: message[ack[win()]]

        Referee->>PlayerProxy_n: win()
        PlayerProxy_n->>Player_n: message[win()]
        Player_n-->>PlayerProxy_n: message[ack[win()]]
        
    end

    Server->>Client: terminates connections
```