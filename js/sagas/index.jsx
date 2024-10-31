import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import * as doc from '../modules/doc';
import * as docs from '../modules/docs';
import * as group from '../modules/group';
import * as groups from '../modules/groups';
import * as currentUser from '../modules/currentUser';
import * as users from '../modules/users';
import * as animateDocRows from '../modules/animateDocRows';

// Sagas.
import stopAnimatingDocRowsAfterDelay from './stopAnimatingDocRowsAfterDelay';
import updateDocTitle from './updateDocTitle';
import updateDocAcceptance from './updateDocAcceptance';
import setDocReaders from './setDocReaders';
import setDocGroups from './setDocGroups';
import createUser from './createUser';
import updateCurrentUser from './updateCurrentUser';
import addFiles from './addFiles';
import consoleLog from './consoleLog';
import updateGroupTitle from './updateGroupTitle';
import createGroup from './createGroup';
import deleteGroup from './deleteGroup';
import setGroupUsers from './setGroupUsers';
import deleteDoc from './deleteDoc';
import viewDoc from './viewDoc';
import acceptDeclineDoc from './acceptDeclineDoc';

// Root Saga.
export default function* rootSaga() {
	try {
		yield all([
			takeEvery('*', consoleLog),
			takeLatest(
				animateDocRows.START_ANIMATING,
				stopAnimatingDocRowsAfterDelay
			),
			takeEvery(doc.server.UPDATE_TITLE, updateDocTitle),
			takeEvery(doc.server.UPDATE_ACCEPTANCE, updateDocAcceptance),
			takeEvery(doc.server.SET_READERS, setDocReaders),
			takeEvery(doc.server.SET_GROUPS, setDocGroups),
			takeEvery(users.server.CREATE, createUser),
			takeEvery(currentUser.server.UPDATE, updateCurrentUser),
			takeEvery(docs.server.ADD_FILES, addFiles),
			takeEvery(docs.server.REMOVE, deleteDoc),
			takeEvery(group.server.UPDATE_TITLE, updateGroupTitle),
			takeEvery(groups.server.CREATE, createGroup),
			takeEvery(groups.server.REMOVE, deleteGroup),
			takeEvery(group.server.SET_USERS, setGroupUsers),
			takeEvery(doc.server.VIEW, viewDoc),
			takeEvery([doc.server.ACCEPT, doc.server.DECLINE], acceptDeclineDoc),
		]);
	} catch (error) {
		console && console.error && console.error('rootSaga error', error);
	}
}
