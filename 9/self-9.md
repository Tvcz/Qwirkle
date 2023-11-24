The commit we tagged for your submission is e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d.
**If you use GitHub permalinks, they must refer to this commit or your self-eval will be rejected.**
Navigate to the URL below to create permalinks and check that the commit hash in the final permalink URL is correct:

https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/tree/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d

## Self-Evaluation Form for Milestone 9

Indicate below each bullet which file/unit takes care of each task.

For `Q/Server/player`,

- explain how it implements the exact same interface as `Q/Player/player`

  The `BasePlayer` implementing the `Player` interface:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/player/player.ts#L60
  
  The `TCPPlayer` implementing the `Player` interface:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.ts#L24-L179
  
  The `TCPPlayer` implements the `Player` interface by implementing the five required methods. For each method, it implements it by building a json message from the method call and arguments, and sending it across a TCP connection to the client. It then waits for a response, validates it, and returns it from the method.
  
- explain how it receives the TCP connection that enables it to communicate with a client

  In `server.ts`, the server creates a `TCPConnection` when a client connects. This `TCPConnection` is used to create a `TCPPlayer`.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/server.ts#L46-L50

  Communication over a TCP connection is abstracted over a `TCPConnection`, which allows the PlayerProxy to send messages and set an `onResponse` callback.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/connection.ts#L33-L62

  The `TCPPlayer` sets its `onResponse` callback to write to a buffer any new messages it receives. 
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.ts#L36-L50

  Then when a message is sent to the client, the TCPPlayer asynchronously awaits the for the buffer to the filled, and uses the buffer result.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.ts#L157-L178
  
- point to unit tests that check whether it writes (proper) JSON to a mock output device

  There are unit tests for all five methods which check whether the `TCPPlayer` sends the correct json messages to the client. 
  In each test, it checks whether the value received by the client is both valid json and the proper form of a message for that method.
  
  `name` method:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.test.ts#L51-L59
  
  `setUp` method:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.test.ts#L70-L105
  
  `takeTurn` method:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.test.ts#L129-L150
  
  `newTiles` method:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.test.ts#L169-L186
  
  `win` method:
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/playerProxy.test.ts#L202-L209
 

For `Q/Client/referee`,

- explain how it implements the same interface as `Q/Referee/referee`

  The `refereeProxy` does not implement the same interface as the `BaseReferee`. This is because it exists on the client side and therefore it does not make sense for it to take in a `ruleBook` or `existingGameState`, since it is only a proxy and does not actually run the game. Additionally, it should not take in `observers`, since if there are remote observers they should exist as proxies on the server side. Finally, it only takes in a single player, since it exists on a client machine. If there are multiple players on the same machine, `refereeProxy` is called for each one. The `refereeProxy` also takes in a connection which it uses to receive messages from the server. 
  
  However, while the `refereeProxy` does not take in the same arguments as a `BaseReferee`, from the perspective of the player it does behave the same. For each message it receives from the server, it translates that message into a valid method name and arguments which it then uses to identify what method to call on the player and call it with the arguments. From the perspective of the player, there is no way to know that this `refereeProxy` is not the actual `BaseReferee` function.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L26-L46
  
- explain how it receives the TCP connection that enables it to communicate with a server

  In `client.ts`, the client calls `refereeProxy` with a `TCPConnection` once it has been made to the server, and a player to run the game for.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/client.ts#L19-L25
  
  Similar to the `PlayerProxy`, TCP communications are abstracted over a `TCPConnection`.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/connection.ts#L33-L62

  The `refereeProxy` sets an `onResponse` callback on the `TCPConnection` to validate and call methods when a message is received from the server. 
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L27-L45
  
  For each method, when the method has been called on the player, the `refereeProxy` sends the result or a acknowledgement back to the server using the `send` method on the `TCPConnection`. For the `win` method, the connection is also terminated.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L57
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L78
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L103
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L120
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.ts#L137-L138  
  
- point to unit tests that check whether it reads (possibly broken) JSON from a mock input device

  These tests show that the `refereeProxy` successfully reads json input over the connection and calls the correct methods on the player with the correct arguments.
  
  While the referee does also handle broken json, validating and ensuring that all json received corresponds to one of the predefined types which correspond to a method call, we were unable to test this due to the asynchronous nature of the calls and the fact that code that throws an error exists on the other side of a socket, and so errors cannot be caught during the call itself, which just sends a message.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/refereeProxy.test.ts#L54-L152

For `Q/Client/client`, explain what happens when the client is started _before_ the server is up and running:

- does it wait until the server is up (best solution)
- does it shut down gracefully (acceptable now, but switch to the first option for 10)

  The client uses `createConnection` to create a network socket using the `net` package, whose behavior by default is to wait indefinetly until the connection can be made. Therefore we use the first option, since the client will keep waiting until the server starts up, at which point the client will call the `refereeProxy` with the connection that has been made.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/client/client.ts#L8-L26

For `Q/Server/server`, explain how the code implements the two waiting periods. 

  The server implements the waiting periods by calling `waitForAdditionalPlayers` once one connection is made.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/server.ts#L52-L56
  
  The sign up operations are defined in callbacks that are made asynchronously:
  
  On each connection to the server, the server attempts to sign up the player.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/server.ts#L46-L50
  
  For each sign up, if the player sends their name in time, then they are added to the list of players. Otherwise, they are not added.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/server.ts#L114-L131
  
  The waiting period happens concurrently with these sign ups:
  
  In `waitForAdditionalPlayers`, the server waits for either the max number of players to sign up or the waiting time to run out. 
  
  - If the waiting time runs out, it returns true if the minimum number of players have signed up. 
  
  - Otherwise it tries to restart the waiting time, which is done at most `SERVER_WAIT_PERIOD_RETRY_COUNT` times, which is set to `1`.
  
  - If it cannot restart the waiting time, it returns false.
  
  - If the maximum number of players have signed up, it returns true.
  
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/server.ts#L67-L94
  
  If `waitForAdditionalPlayers` returns true, the game is ran with the players that have signed up.
  
  If it returns false, an empty game result is returned.
  
  Either way, at the end, the server terminates connections with the clients and closes.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/e6158c3cb2f8843c7c55b38a1e6e49c6c65d866d/Q/src/remote/server/server.ts#L52-L64
  
  

The ideal feedback for each of these three points is a GitHub
perma-link to the range of lines in a specific file or a collection of
files.

A lesser alternative is to specify paths to files and, if files are
longer than a laptop screen, positions within files are appropriate
responses.

You may wish to add a sentence that explains how you think the
specified code snippets answer the request.

If you did *not* realize these pieces of functionality, say so.

