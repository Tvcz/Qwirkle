import {
  ALL_TILES_BONUS_POINT_AMOUNT,
  Q_BONUS_POINT_AMOUNT,
  REFEREE_PLAYER_TIMEOUT_MS
} from '../../constants';
import { JState } from '../data/data.types';

const DEFAULT_QBO = Q_BONUS_POINT_AMOUNT;
const DEFAULT_FBO = ALL_TILES_BONUS_POINT_AMOUNT;
export const DEFAULT_REFEREE_STATE_CONFIG = {
  qbo: DEFAULT_QBO,
  fbo: DEFAULT_FBO
};

const DEFAULT_STATE: JState = {
  map: [[0, [0, { color: 'red', shape: 'circle' }]]],
  'tile*': [],
  players: [
    {
      name: 'Player 1',
      'tile*': [],
      score: 0
    },
    {
      name: 'Player 2',
      'tile*': [],
      score: 0
    }
  ]
};
const DEFAULT_QUIET = false;
const DEFAULT_PER_TURN = REFEREE_PLAYER_TIMEOUT_MS / 1000;
const DEFAULT_OBSERVE = false;

export const DEFAULT_REFEREE_CONFIG: RefereeConfig = {
  state0: DEFAULT_STATE,
  quiet: DEFAULT_QUIET,
  'config-s': DEFAULT_REFEREE_STATE_CONFIG,
  'per-turn': DEFAULT_PER_TURN,
  observe: DEFAULT_OBSERVE
};

export type RefereeConfig = {
  state0: JState;
  quiet: boolean;
  'config-s': RefereeStateConfig;
  'per-turn': number;
  observe: boolean;
};

export type RefereeStateConfig = {
  qbo: number; // Q Bonus
  fbo: number; // Finish Bonus
};

export function generateRefereeConfig(
  state0 = DEFAULT_STATE,
  quiet = DEFAULT_QUIET,
  configS = DEFAULT_REFEREE_STATE_CONFIG,
  perTurn = DEFAULT_PER_TURN,
  observe = DEFAULT_OBSERVE
): object {
  return {
    state0,
    quiet,
    'config-s': configS,
    'per-turn': perTurn,
    observe
  };
}

export function generateRefereeStateConfig(
  qbo = DEFAULT_QBO,
  fbo = DEFAULT_FBO
): object {
  return {
    qbo,
    fbo
  };
}
