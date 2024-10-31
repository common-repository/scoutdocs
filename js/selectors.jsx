import uniq from 'lodash/fp/uniq';
import flatten from 'lodash/fp/flatten';
import flow from 'lodash/fp/flow';
import without from 'lodash/fp/without';
import sortBy from 'lodash/fp/sortBy';
import identity from 'lodash/fp/identity';

import * as docs from './modules/docs';
import * as groups from './modules/groups';
import * as users from './modules/users';
import * as currentUser from './modules/currentUser';

export const uploaderOpen = state => state.uploader.open;
export const groupManagerOpen = state => state.groupManager.open;

export const getUserKey = state => currentUser.getKey(state.user);
export const getUserNonce = state => currentUser.getNonce(state.user);

export const getApiUrl = state => state.urls.api;
export const getLocalUrl = state => state.urls.scoutdocs;
export const getBasePath = state => state.urls.scoutdocsPath;

export const getUser = (state, id) => users.getUser(state.users, id);

export const getGroup = (state, id) => groups.getGroup(state.groups, id);

const getGroupProp = prop => (...args) => getGroup(...args)[prop];

export const getGroupTitle = getGroupProp('title');

export const getGroupUserIds = getGroupProp('users');

export const getDoc = (state, id) => docs.getDoc(state.docs, id);

const getDocProp = prop => (...args) => {
	const doc = getDoc(...args);
	return doc ? doc[prop] : null;
};

export const getDocTitle = getDocProp('title');
export const getDocAcceptance = getDocProp('acceptance');
export const getDocReaders = getDocProp('readers');
export const getDocGroups = getDocProp('groups');
export const getDocStatus = getDocProp('status');

export const getAllDocReaders = (state, id) => {
	const doc = getDoc(state, id);

	if (!doc || (!doc.readers && !doc.groups)) {
		return 0;
	}

	const readers = doc.readers;
	const groupReaders = doc.groups.map(g => getGroupUserIds(state, g));
	const readerIds = [...readers, ...groupReaders];
	const withoutCurrentUser = without([state.user.id]);
	const idSort = sortBy(identity);

	return flow(flatten, uniq, idSort, withoutCurrentUser)(readerIds);
};

export const getTotalDocReaders = (state, id) =>
	getAllDocReaders(state, id).length;

export const getUserDocStatus = (state, docId, userId) =>
	state.docReaderStatuses[docId] && state.docReaderStatuses[docId][userId];

export const getIds = state => state.map(t => t.id);
