import { call, select, put } from 'redux-saga/effects';
import * as doc from '../modules/doc';
import * as selectors from '../selectors';
import remoteAjax from './ajax';

export default function* viewDoc(action) {
	try {
		// Get the old status.
		const oldStatus = yield select(selectors.getDocStatus, action.id);

		if ('unread' !== oldStatus) {
			return; // No further action needed.
		}

		// Set up the actions.
		const updateLocal = put(doc.setStatus(action.id, 'read'));
		const undoLocal = put(doc.setStatus(action.id, oldStatus));
		const updateRemote = call(remoteAjax, {
			path: `document/${action.id}/status/read`,
		});

		// Hopefully update the doc.
		yield updateLocal;

		try {
			// Try updating the server.
			yield updateRemote;
		} catch (error) {
			yield undoLocal;
		}
	} catch (e) {
		console.error(e);
	}
}
