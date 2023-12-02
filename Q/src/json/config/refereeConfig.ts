import {
  ALL_TILES_BONUS_POINT_AMOUNT,
  Q_BONUS_POINT_AMOUNT,
  REFEREE_PLAYER_TIMEOUT_MS
} from '../../constants';
import { JState } from '../../game/types/json.types';

const DEFAULT_QBO = Q_BONUS_POINT_AMOUNT;
const DEFAULT_FBO = ALL_TILES_BONUS_POINT_AMOUNT;

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
const DEFAULT_CONFIG_S = {
  qbo: DEFAULT_QBO,
  fbo: DEFAULT_FBO
};
const DEFAULT_PER_TURN = REFEREE_PLAYER_TIMEOUT_MS;
const DEFAULT_OBSERVE = false;

export const defaultRefereeConfig: RefereeConfig = {
  state0: DEFAULT_STATE,
  quiet: DEFAULT_QUIET,
  configS: DEFAULT_CONFIG_S,
  perTurn: DEFAULT_PER_TURN,
  observe: DEFAULT_OBSERVE
};

export type RefereeConfig = {
  state0: JState;
  quiet: boolean;
  configS: RefereeStateConfig;
  perTurn: number;
  observe: boolean;
};

type RefereeStateConfig = {
  qbo: number; // Q Bonus
  fbo: number; // Finish Bonus
};
