The commit we tagged for your submission is 5c1acb96771a1223990914fd37e01e1ad9f51351.
**If you use GitHub permalinks, they must refer to this commit or your self-eval will be rejected.**
Navigate to the URL below to create permalinks and check that the commit hash in the final permalink URL is correct:

https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/tree/5c1acb96771a1223990914fd37e01e1ad9f51351

## Self-Evaluation Form for Milestone 8

Indicate below each bullet which file/unit takes care of each task:

- concerning the modifications to the referee: 

  - is the referee programmed to the observer's interface
    or is it hardwired?
    
    The referee is programmed to the observer's interface, as can be seen here where we define the types for a `RefereeFunction`'s input:
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/referee/referee.types.ts#L20
    
    The `ObserverAPI` interface is define as follows:
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/observer/observer.ts#L10-L65

  - if an observer is desired, is every state per player turn sent to
    the observer? Where? 
    
    Yes, during the game loop all observers are notified of the current state of a game following each turn:
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/referee/refereeUtils.ts#L180-L183
    
    This is performed in the `updateObservers` helper function:
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/referee/refereeUtils.ts#L188-L199

  - if an observer is not desired, how does the referee avoid calls to
    the observer?
    
    As shown in the above type definition of a Referee's parameters and the above `updateObservers` function, the observers of a game are passed to the Referee in a list, so if no observers are desired an empty list is passed into the Referee. Since the Referee will normally iterate over the list, if given an empty list it will make no calls. 
    
    The functionality for passing in observers based on the `-show` flag is shown below:
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/electron/main/main.ts#L5-L8

- concerning the implementation of the observer:

  - does the purpose statement explain how to program to the
    observer's interface? 
    
    I believe it does, since it explains that the `receiveState` method informs the observer of the state of the game by giving them data that they can render, and it explains that `gameOver` informs the observer that no new states will be received, and gives them the final game state, the winner names, and the elimated player names. Using this information you could theoretically program another Observer since you know the structure of the input types and what they represent.
   
    Below are the described purpose statements: 
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/observer/observer.ts#L10-L32
    
  - does the purpose statement explain how a user would use the
    observer's view? Or is it explained elsewhere? 
    
    No, though the `receiveState` function does explain that the received game state can be used to render a GUI.
    https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/5c1acb96771a1223990914fd37e01e1ad9f51351/Q/src/observer/observer.ts#L17

The ideal feedback for each of these three points is a GitHub
perma-link to the range of lines in a specific file or a collection of
files.

A lesser alternative is to specify paths to files and, if files are
longer than a laptop screen, positions within files are appropriate
responses.

You may wish to add a sentence that explains how you think the
specified code snippets answer the request.

If you did *not* realize these pieces of functionality, say so.

