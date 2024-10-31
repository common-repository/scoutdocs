import { call, select, put } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as doc from '../modules/doc';
import remoteAjax from './ajax';
import isEqual from 'lodash/fp/isEqual';

export default function* setDocReaders(action) {
	// Grab the old value.
	const old = yield select(selectors.getDocReaders, action.id);

	if (isEqual(old, action.users)) {
		return;
	}

	// Set up the actions.
	const updateLocal = put(doc.setReaders(action.id, action.users));
	const undoLocal = put(doc.setReaders(action.id, old));
	const updateRemote = call(remoteAjax, {
		path: 'document/' + action.id,
		data: { readers: action.users },
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
