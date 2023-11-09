import { BaseObserver } from '../../observer/observer';
import { BaseTile } from '../../game/map/tile';
import { processInputAndRunGame } from './xgame-with-observer';

const showObserver = process.argv.includes('-show');
const observers = showObserver ? [new BaseObserver<BaseTile>()] : [];

processInputAndRunGame(observers);
