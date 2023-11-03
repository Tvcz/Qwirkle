# Todo list

# Completed

#### 1. Combine client player info with game state player

##### Our current referee implementation stores the list of Player classes and then also create a GameState which has a list of PlayerStates. We want to combine these data structures so that the information isn't represented twice.

- Commit Message: started using name instead of id
  - SHA: 677d8e52c88a6b68636be73828ae3d3dd17878dc
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/677d8e52c88a6b68636be73828ae3d3dd17878dc
- Commit Message: player refactoring for names
  - SHA: edf6672d5459353712547bfddb5de9a458d016a3
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/edf6672d5459353712547bfddb5de9a458d016a3
- Commit Message: finished refactoring setting up and tearing down game with the refere…
  - SHA: 5468423146719ebd834cb4d9ad9a4cfb607e09da
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/5468423146719ebd834cb4d9ad9a4cfb607e09da
- Commit Message: added unit tests and fixed old tests that were broken
  - SHA: f70eb26fa2e9e98e4be7a9ddb57f9b1b3aa6cc8f
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/f70eb26fa2e9e98e4be7a9ddb57f9b1b3aa6cc8f

#### 2. Update player turn queue's round functionality

##### The way that we handle the turn queue's knowledge of when a round is over is not very robust. We currently store the first player to go in the round and wait for them to go again. Instead we want store a set of all players ids that have gone in a round so far, and the round ends when every player in the turn queue is in that set. This will make it easier to account for eliminated players. We also want to slightly change the way we store previous turns, making it a requirement that the nextTurn() method in the turn queue takes in the turn action that just occurred.

- Commit Message: turn queue round refactor
  - SHA: 0f264eea9eb87133c1d2d3ec951c9a0a81b82c84
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/0f264eea9eb87133c1d2d3ec951c9a0a81b82c84
- Commit Message: fixed bug to store turn action for eliminated player
  - SHA: 74b8884a4aef8aa4563b888b27969fe65ff6c561
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/74b8884a4aef8aa4563b888b27969fe65ff6c561
- Commit Message: added tests for new functionality and fixed old tests
  - SHA: 3de4c0003312e5a4c8d2fb8f9c4c179067b07006
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/3de4c0003312e5a4c8d2fb8f9c4c179067b07006

#### 3. Break up run game function

##### Our runGame helper function is a bit difficult to read. We want to break this up further into helper function and make runGame just a pipeline function.

- Commit Message: refactored end game check
  - SHA: 0343acbdeeb4e90f55c41df8c281e243c1d3b04a
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/0343acbdeeb4e90f55c41df8c281e243c1d3b04a
- Commit Message: continued refactoring of runGame, and fixed/added tests
  - SHA: 0593648599bbcfce6120dc92c071d3252b63a98c
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/0593648599bbcfce6120dc92c071d3252b63a98c

#### 4. Make TurnAction a class

##### Our TurnAction type requires that in order to use the list of TilePlacements, we first check that the action isn't a PASS or EXCHANGE turn. We want to make this a class so we can have an explicit check for if it's a PLACEMENT, which will be more clear.

- Commit Message: turn action refactor (type -> class)
  - SHA: bb244ee1d3a46643537503dff40e931cf195e87c
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/bb244ee1d3a46643537503dff40e931cf195e87c
- Commit Message: finished refactoring turn action, added interface, pulled out to file…
  - SHA: 476457e545d15eacfa15eda24fe12eb59151370a
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/476457e545d15eacfa15eda24fe12eb59151370a

#### 5. EndOfGame rules shouldn't take in the entire PlayerTurnQueue

##### Right now, our EndOfGame rules take in a PlayerTurnQueue, which gives them too much power, for example they have access to the nextTurn() function, which they shouldn't. We want to update the rule type to only take in the necessary information.

- Commit Message: replaced turn queue with only view only data in endofgame rules
  - SHA: 1dacdb62b637b69ed69022d85db32f00989bacb7
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/1dacdb62b637b69ed69022d85db32f00989bacb7
- Commit Message: fixing tests
  - SHA: 2d5c095ecc950d9d856e04ae1fa1698b7033a33a
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/2d5c095ecc950d9d856e04ae1fa1698b7033a33a

#### 6. Constants file

##### Add a constants file rather than have constants floating around in various files.

- Commit Message: added constants file
  - SHA: 79a868e64d4f101571bcb18be93caf15f6406a13
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/79a868e64d4f101571bcb18be93caf15f6406a13
- Commit Message: separate out bonus points
  - SHA: d537f8cb9c40caa3ee5c0d589ca313a84c5c52d9
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/d537f8cb9c40caa3ee5c0d589ca313a84c5c52d9

#### 7. Make JSON processing more robust

##### Our JSON processing will break if the input isn't exactly as specified (there's more than two inputs or stdin isn't closed), so we want to make it more robust to still run in those cases.

- Commit Message: added constraints to json parsing
  - SHA: 9b6866801268d18753521b97b106873407a8420f
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/9b6866801268d18753521b97b106873407a8420f
- Commit Message: added more validation checks for json constraints
  - SHA: 37b609446628c43b848de49df1df8bebf391c289
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/37b609446628c43b848de49df1df8bebf391c289

#### 8. Make all purpose statements JSDoc

##### Some of the purpose statements we wrote for some functions use normal comments instead of JSDoc. Changing these to JSDoc will let them appear when hovering over the function.

- Commit Message: changed all purpose statements to jsdoc
  - SHA: 83a3093df5bdd790393c222151ee5ed9c730d258
  - Link: https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-mustangs/commit/83a3093df5bdd790393c222151ee5ed9c730d258

#### 9. Required Revision: Change Program so bonus for placing a Q could be set to 8 and bonus for finishing a game could be set to 4

##### This revision did not appear in our TODO list because it was already done. The bonus for changing a Q could be changed by changing the constant given to the `pointsPerQ` function used in the `Q/src/game/rules/ruleBook.ts` file. Likewise for ending a game, change the constant given to the `pointsForPlayingAllTiles` function in the same file.
