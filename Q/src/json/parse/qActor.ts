import { ShapeColorTile } from '../../game/map/tile';
import { QRuleBook } from '../../game/rules/ruleBook';
import { JActorsB, JCheat, JExn, JStrategy } from '../data/data.types';
import {
  isCheatJActor,
  isExceptionJActor,
  isLoopJActor,
  isSimpleJActor
} from '../data/dataTypeGuards';
import {
  Player,
  BasePlayer,
  DelayedSetupTimeoutPlayer,
  DelayedTurnTimeoutPlayer,
  DelayedNewTilesTimeoutPlayer,
  DelayedWinTimeoutPlayer,
  SetupExceptionPlayer,
  TurnExceptionPlayer,
  NewTilesExceptionPlayer,
  WinExceptionPlayer
} from '../../player/player';
import {
  Strategy,
  DagStrategy,
  LdasgStrategy,
  NonAdjacentCoordinateStrategy,
  TileNotOwnedStrategy,
  NotALineStrategy,
  BadAskForTilesStrategy,
  NoFitStrategy
} from '../../player/strategy';

export const toQPlayers = (
  jActors: JActorsB,
  rulebook: QRuleBook<ShapeColorTile>
): Player<ShapeColorTile>[] => {
  return jActors.map((jActor) => {
    const name = jActor[0];
    const jStrategy = jActor[1];
    const qStrategy = jStrategyToQStrategy(jStrategy);

    if (isSimpleJActor(jActor)) {
      return new BasePlayer(name, qStrategy, rulebook);
    }
    if (isExceptionJActor(jActor)) {
      const jExn = jActor[2];
      return getExceptionPlayer(name, qStrategy, rulebook, jExn);
    }
    if (isCheatJActor(jActor)) {
      const jCheat = jActor[3];
      const cheatStrategy = getCheatStrategy(jCheat, qStrategy);
      return new BasePlayer(name, cheatStrategy, rulebook);
    }
    if (isLoopJActor(jActor)) {
      const jExn = jActor[2];
      const count = jActor[3];
      return getInfiniteLoopPlayer(name, qStrategy, rulebook, jExn, count);
    }
    throw new Error('invalid JActor');
  });
};

const getCheatStrategy = (
  jCheat: JCheat,
  qStrategy: Strategy<ShapeColorTile>
): Strategy<ShapeColorTile> => {
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

const jStrategyToQStrategy = (
  jStrategy: JStrategy
): Strategy<ShapeColorTile> => {
  switch (jStrategy) {
    case 'dag':
      return new DagStrategy();
    case 'ldasg':
      return new LdasgStrategy();
  }
};

const getExceptionPlayer = (
  name: string,
  strategy: Strategy<ShapeColorTile>,
  rulebook: QRuleBook<ShapeColorTile>,
  jExn: JExn
): Player<ShapeColorTile> => {
  switch (jExn) {
    case 'setup':
      return new SetupExceptionPlayer(name, strategy, rulebook);
    case 'take-turn':
      return new TurnExceptionPlayer(name, strategy, rulebook);
    case 'new-tiles':
      return new NewTilesExceptionPlayer(name, strategy, rulebook);
    case 'win':
      return new WinExceptionPlayer(name, strategy, rulebook);
    default:
      throw new Error(`Invalid exception type ${jExn}`);
  }
};

const getInfiniteLoopPlayer = (
  name: string,
  strategy: Strategy<ShapeColorTile>,
  rulebook: QRuleBook<ShapeColorTile>,
  jExn: JExn,
  count: number
): Player<ShapeColorTile> => {
  switch (jExn) {
    case 'setup':
      return new DelayedSetupTimeoutPlayer(name, strategy, rulebook, count);
    case 'take-turn':
      return new DelayedTurnTimeoutPlayer(name, strategy, rulebook, count);
    case 'new-tiles':
      return new DelayedNewTilesTimeoutPlayer(name, strategy, rulebook, count);
    case 'win':
      return new DelayedWinTimeoutPlayer(name, strategy, rulebook, count);
    default:
      throw new Error(`Invalid exception type ${jExn}`);
  }
};
