import { delay } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import * as animateDocRows from '../modules/animateDocRows';

// SAGA: when animateDocRows.START_ANIMATING is called, 500 ms later, turn it off.
export default function* stopAnimatingDocRowsAfterDelay() {
	yield call(delay, 500);
	yield put(animateDocRows.stopAnimating());
}
