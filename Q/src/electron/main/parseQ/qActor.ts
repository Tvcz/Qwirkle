import { BaseTile } from '../../../game/map/tile';
import { QRuleBook } from '../../../game/rules/ruleBook';
import {
  Player,
  BasePlayer,
  DelayedSetupTimeoutPlayer,
  DelayedTurnTimeoutPlayer,
  DelayedNewTilesTimeoutPlayer,
  DelayedWinTimeoutPlayer
} from '../../../player/player';
import {
  Strategy,
  DagStrategy,
  LdasgStrategy,
  NonAdjacentCoordinateStrategy,
  TileNotOwnedStrategy,
  NotALineStrategy,
  BadAskForTilesStrategy,
  NoFitStrategy
} from '../../../player/strategy';
import { isJExn } from '../parseJson/parseActor';
import { JActor, JStrategy, JExn, JCheat } from '../types';

export const toQPlayers = (
  jActors: JActor[],
  rulebook: QRuleBook<BaseTile>
): Player<BaseTile>[] => {
  return jActors.map((jActor) => {
    const name = jActor[0];
    const jStrategy = jActor[1];
    const qStrategy = jStrategyToQStrategy(jStrategy);

    if (jActor[2] && isJExn(jActor[2])) {
      let methodCallsUntilDelay = jActor[3];
      if (typeof methodCallsUntilDelay !== 'number') {
        methodCallsUntilDelay = 1;
      }
      return getExceptionPlayer(
        name,
        qStrategy,
        rulebook,
        jActor[2],
        methodCallsUntilDelay
      );
    }

    let cheatStrategy: Strategy<BaseTile> | undefined;
    if (jActor.length === 4 && jActor[2] === 'a cheat') {
      const jCheat = jActor[3];
      cheatStrategy = getCheatStrategy(jCheat, qStrategy);
    }

    return new BasePlayer(name, cheatStrategy ?? qStrategy, rulebook);
  });
};

const getCheatStrategy = (
  jCheat: JCheat,
  qStrategy: Strategy<BaseTile>
): Strategy<BaseTile> => {
  switch (jCheat) {
    case 'non-adjacent-coordinate':
      return new NonAdjacentCoordinateStrategy();
    case 'tile-not-owned':
      return new TileNotOwnedStrategy(qStrategy);
    case 'not-a-line':
      return new NotALineStrategy(qStrategy);
    case 'bad-ask-for-tiles':
      return new BadAskForTilesStrategy(qStrategy);
    case 'no-fit':
      return new NoFitStrategy(qStrategy);
  }
};

const jStrategyToQStrategy = (jStrategy: JStrategy): Strategy<BaseTile> => {
  switch (jStrategy) {
    case 'dag':
      return new DagStrategy();
    case 'ldasg':
      return new LdasgStrategy();
  }
};

const getExceptionPlayer = (
  name: string,
  strategy: Strategy<BaseTile>,
  rulebook: QRuleBook<BaseTile>,
  jExn: JExn,
  calls = 1
): Player<BaseTile> => {
  switch (jExn) {
    case 'setup':
      return new DelayedSetupTimeoutPlayer(name, strategy, rulebook, calls);
    case 'take-turn':
      return new DelayedTurnTimeoutPlayer(name, strategy, rulebook, calls);
    case 'new-tiles':
      return new DelayedNewTilesTimeoutPlayer(name, strategy, rulebook, calls);
    case 'win':
      return new DelayedWinTimeoutPlayer(name, strategy, rulebook, calls);
    default:
      throw new Error(`Invalid exception type ${jExn}`);
  }
};
