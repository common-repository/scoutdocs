import { call, select, put } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as doc from '../modules/doc';
import remoteAjax from './ajax';

export default function* updateDocAcceptance(action) {
	// Grab the old value.
	const old = yield select(selectors.getDocAcceptance, action.id);

	// Set up the actions.
	const updateLocal = put(doc.updateAcceptance(action.id, action.acceptance));
	const undoLocal = put(doc.updateAcceptance(action.id, old));
	const updateRemote = call(remoteAjax, {
		path: 'document/' + action.id,
		data: { acceptance: action.acceptance ? 1 : 0 },
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
}
