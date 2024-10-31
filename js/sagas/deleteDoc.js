import { call, put } from 'redux-saga/effects';
import * as docs from '../modules/docs';
import * as animateDocRows from '../modules/animateDocRows';
import { remoteAjax } from './ajax';

export default function* deleteDoc(action) {
	try {
		const response = yield call(remoteAjax, {
			path: 'document/' + action.id,
			method: 'delete',
		});

		if (response.data.success) {
			yield put(animateDocRows.startAnimating());
			yield put(docs.remove(action.id));
		}
	} catch (error) {}
}
