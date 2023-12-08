import { BaseObserver } from '../../observer/observer';
import { processInputAndRunGame } from './xgames-with-observer';

const showObserver = process.argv.includes('-show');
const observers = showObserver ? [new BaseObserver()] : [];

processInputAndRunGame(observers);
