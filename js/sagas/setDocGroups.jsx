import { call, select, put } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as doc from '../modules/doc';
import remoteAjax from './ajax';
import isEqual from 'lodash/fp/isEqual';

export default function* setDocGroups(action) {
	// Grab the old value.
	const old = yield select(selectors.getDocGroups, action.id);

	if (isEqual(old, action.groups)) {
		return;
	}

	// Set up the actions.
	const updateLocal = put(doc.setGroups(action.id, action.groups));
	const undoLocal = put(doc.setGroups(action.id, old));
	const updateRemote = call(remoteAjax, {
		path: 'document/' + action.id,
		data: { groups: action.groups },
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
