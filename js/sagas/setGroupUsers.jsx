import { call, select, put } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as group from '../modules/group';
import remoteAjax from './ajax';
import isEqual from 'lodash/fp/isEqual';

export default function* setGroupUsers(action) {
	// Grab the old value.
	const old = yield select(selectors.getGroupUserIds, action.id);

	if (isEqual(old, action.users)) {
		return;
	}

	// Set up the actions.
	const updateLocal = put(group.setUsers(action.id, action.userIds));
	const undoLocal = put(group.setUsers(action.id, old));
	const updateRemote = call(remoteAjax, {
		path: 'group/' + action.id,
		data: { users: action.userIds },
	});

	// Hopefully update the group.
	yield updateLocal;

	try {
		// Try updating the server.
		yield updateRemote;
	} catch (error) {
		// Undo on failure.
		yield undoLocal;
	}
}
