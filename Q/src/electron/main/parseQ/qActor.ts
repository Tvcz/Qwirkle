import { BaseTile } from '../../../game/map/tile';
import { QRuleBook } from '../../../game/rules/ruleBook';
import {
  TilePlacement,
  RelevantPlayerInfo
} from '../../../game/types/gameState.types';
import { Player, BasePlayer } from '../../../player/player';
import { Strategy, DagStrategy, LdasgStrategy } from '../../../player/strategy';
import { JActor, JStrategy, JExn } from '../types';

export const toQPlayers = (
  jActors: JActor[],
  rulebook: QRuleBook<BaseTile>
): Player<BaseTile>[] => {
  return jActors.map((jActor) => {
    const name = jActor[0];
    const jStrategy = jActor[1];
    const qStrategy = jStrategyToQStrategy(jStrategy);

    const basePlayer = new BasePlayer(name, qStrategy, rulebook);

    const exn = jActor[2];

    return new ExceptionPlayer(basePlayer, exn);
  });
};

const jStrategyToQStrategy = (jStrategy: JStrategy): Strategy<BaseTile> => {
  switch (jStrategy) {
    case 'dag':
      return new DagStrategy();
    case 'ldasg':
      return new LdasgStrategy();
  }
};

class ExceptionPlayer implements Player<BaseTile> {
  private basePlayer: BasePlayer<BaseTile>;
  private exception: JExn | undefined;

  constructor(basePlayer: BasePlayer<BaseTile>, exception: JExn | undefined) {
    this.basePlayer = basePlayer;
    this.exception = exception;
  }

  public name() {
    return this.basePlayer.name();
  }

  private throwIfExnMatch(exn: JExn) {
    if (exn === this.exception) {
      throw new Error('Player misbehaving');
    }
  }

  public setUp(m: TilePlacement<BaseTile>[], st: BaseTile[]) {
    this.throwIfExnMatch('setup');
    return this.basePlayer.setUp(m, st);
  }

  public takeTurn(s: RelevantPlayerInfo<BaseTile>) {
    this.throwIfExnMatch('take-turn');
    return this.basePlayer.takeTurn(s);
  }

  public newTiles(st: BaseTile[]) {
    this.throwIfExnMatch('new-tiles');
    return this.basePlayer.newTiles(st);
  }

  public win(w: boolean) {
    this.throwIfExnMatch('win');
    return this.basePlayer.win(w);
  }
}
