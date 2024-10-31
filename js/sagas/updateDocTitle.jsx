import { call, select, put } from 'redux-saga/effects';
import * as doc from '../modules/doc';
import * as selectors from '../selectors';
import remoteAjax from './ajax';

export default function* updateDocTitle(action) {
	try {
		// Grab the old value.
		const old = yield select(selectors.getDocTitle, action.id);

		// Set up the actions.
		const updateLocal = put(doc.updateTitle(action.id, action.title));
		const undoLocal = put(doc.updateTitle(action.id, old));
		const updateRemote = call(remoteAjax, {
			path: 'document/' + action.id,
			data: { title: action.title },
		});

		// Hopefully update the doc.
		yield updateLocal;

		try {
			// Try updating the server.
			yield updateRemote;
		} catch (error) {
			// Undo on failure.
			yield undoLocal;
		}
	} catch (e) {
		console.error(e);
	}
}
