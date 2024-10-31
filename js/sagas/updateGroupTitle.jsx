import { call, select, put } from 'redux-saga/effects';
import * as group from '../modules/group';
import * as groups from '../modules/groups';
import * as selectors from '../selectors';
import remoteAjax from './ajax';

export default function* updateGroupTitle(action) {
	try {
		// Grab the old value.
		const old = yield select(selectors.getGroupTitle, action.id);

		// Set up the actions.
		const updateLocal = put(group.updateTitle(action.id, action.title));
		const undoLocal = put(group.updateTitle(action.id, old));
		const updateRemote = call(remoteAjax, {
			path: 'group/' + action.id,
			data: { title: action.title },
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
	} catch (e) {
		console.error(e);
	}
}
