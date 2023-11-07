
```mermaid
sequenceDiagram
    participant Referee
    participant RefereeProxy
    participant PlayerProxy_1
    participant Player_1
    participant PlayerProxy_n
    participant Player_n

    Player_1->>RefereeProxy: joinGame()
    Player_n->>RefereeProxy: joinGame()

    alt at least two players have joined game and 5 minutes have passed
        RefereeProxy->>Referee: start(PlayerProxy_1 ... PlayerProxy_n)


        Referee->>PlayerProxy_1: name()
        PlayerProxy_1->>Player_1: name()
        Player_1-->>PlayerProxy_1: response[name]
        PlayerProxy_1-->>Referee: response[name]

        Referee->>PlayerProxy_n: name()
        PlayerProxy_n->>Player_n: name()
        Player_n-->>PlayerProxy_n: response[name]
        PlayerProxy_n-->>Referee: response[name]


        loop while game is not over
            Referee->>PlayerProxy_1: takeTurn()
            PlayerProxy_1->>Player_1: takeTurn()
            Player_1-->>PlayerProxy_1: response[turn]
            PlayerProxy_1-->>Referee: response[turn]

            Referee->>PlayerProxy_n: takeTurn()
            PlayerProxy_n->>Player_n: takeTurn()
            Player_n-->>PlayerProxy_n: response[turn]
            PlayerProxy_n-->>Referee: response[turn]
            

            alt if player placed or exchanged tiles
                Referee->>PlayerProxy_1: newTiles()
                PlayerProxy_1->>Player_1: newTiles()

                Referee->>PlayerProxy_n: newTiles()
                PlayerProxy_n->>Player_n: newTiles()
            end
        end 

        Referee->>PlayerProxy_1: win()
        PlayerProxy_1->>Player_1: win()

        Referee->>PlayerProxy_n: win()
        PlayerProxy_n->>Player_n: win()
    end

```

- Server needs to gather players
    - `Player` hits a `RefereeProxy` with `joinGame` which then triggers the
      referee proxy to build a corresponding `PlayerProxy`
    - If there are at least two players, after five minutes from the first
      player joining the `RefereeProxy` gives the `Referee` the list of
      `PlayerProxy`s, which implement the `Player` interface
- Launching (`takeTurn` and `newTiles`) a game and reporting result (`win`)

- TODO JSON communication (what do requests internal to proxies look like)
    - anything that goes through a proxy must be serializable
    - PlayerProxy for instance exists half on the server side and half on the
      client save 
        - server is method calls with data -> network requests with json
        - client is network listeners with json -> method calls with data

- things are translated to json in the proxy and then translated back on other
side of proxy
```
json type for tile:
{
    shape: 
    color: 
}

```