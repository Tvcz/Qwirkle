import { BaseBagOfTiles } from '../../game/gameState/bagOfTiles';
import { BaseGameState } from '../../game/gameState/gameState';
import PlayerTurnQueue from '../../game/gameState/playerTurnQueue';
import { BaseTile, ShapeColorTile } from '../../game/map/tile';
import { BaseRuleBook } from '../../game/rules/ruleBook';
import { JActorsB, JState } from '../../json/data.types';
import { BaseObserver } from '../../observer/observer';
import { BaseReferee } from '../../referee/referee';
import { toQPlayers } from '../../json/parse/qActor';
import { toQState } from '../../json/parse/qState';
import { parse } from 'JSONStream';
import { isJActorsB, isJState } from '../../json/dataTypeGuards';

let inputState: JState | undefined = undefined;
let inputActors: JActorsB | undefined = undefined;

export function processInputAndRunGame(observers: BaseObserver<BaseTile>[]) {
  processInput();
  runGame(observers);
}

/**
 * Checks whether the input is of the expected type, and throws an error if not.
 * @param input the value to check the type of
 * @param isType a type guard for the expected type
 * @param typeName a string representing the name of the type for error messages
 * @returns the input value, if it is of the expected type
 */
function ensureIsType<T>(
  input: unknown,
  isType: (val: unknown) => val is T,
  typeName: string
): T {
  if (!isType(input)) {
    throw new Error(`invalid ${typeName}`);
  }
  return input;
}

/**
 * Processes the input from stdin and stores it in the inputState and inputActors variables.
 */
function processInput() {
  process.stdin.pipe(parse()).on('data', (data: unknown) => {
    if (!inputState) {
      inputState = ensureIsType(data, isJState, 'JState');
    }
    if (!inputActors) {
      inputActors = ensureIsType(data, isJActorsB, 'JActors array');
    }
    throw new Error('invalid JSON input, JPub and JStrategy already specified');
  });
}

/**
 * Runs the game with the given observers.
 * @param observers the observers who spectate the game
 */
function runGame(observers: BaseObserver<BaseTile>[]) {
  process.stdin.on('end', async () => {
    if (!inputState || !inputActors) {
      throw new Error('invalid JSON input, JPub and JStrategy not defined');
    }

    if (inputState.players.length !== inputActors.length) {
      throw new Error(
        'The array of JPlayers in JState must contain as many players as the JActors.'
      );
    }

    const rulebook = new BaseRuleBook();

    const players = toQPlayers(inputActors, rulebook);

    const { qMap, qTilesInBag, playerStates } = await toQState(
      inputState,
      players
    );

    const qBagOfTiles = new BaseBagOfTiles(qTilesInBag);
    const qPlayerTurnQueue = new PlayerTurnQueue<ShapeColorTile>(playerStates);

    const qGameState = new BaseGameState(qMap, qPlayerTurnQueue, qBagOfTiles);

    const [winners, eliminated] = await BaseReferee(
      players,
      observers,
      rulebook,
      qGameState
    );
    winners.sort();

    process.stdout.write(JSON.stringify([winners, eliminated]));

    if (observers.length == 0) {
      process.exit();
    }
  });
}
