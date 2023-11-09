import { BaseObserver } from '../../observer/observer';
import { BaseTile } from '../../game/map/tile';
import { processInputAndRunGame } from './xgame-with-observer';
import { RenderableGameState } from '../../game/types/gameState.types';
import Coordinate from '../../game/map/coordinate';

const showObserver = process.argv.includes('-show');
const observers = showObserver ? [new BaseObserver<BaseTile>()] : [];

processInputAndRunGame(observers);

// const gameState: RenderableGameState<BaseTile> = {
//   mapState: {
//     dimensions: {
//       topmost: 0,
//       bottommost: 0,
//       leftmost: 0,
//       rightmost: 0
//     },
//     tilePlacements: [
//       {
//         tile: new BaseTile('star', 'red'),
//         coordinate: new Coordinate(0, 0)
//       }
//     ]
//   },
//   players: [],
//   remainingTiles: []
// };

// const observer = new BaseObserver<BaseTile>();
// for (let i = 0; i < 15; i += 1) {
//   observer.receiveState(gameState);
// }
