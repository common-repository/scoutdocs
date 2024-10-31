import * as idList from './idList';
import scoutdocsReducer from '../utils/scoutdocs-reducer';
import reduceReducers from 'reduce-reducers';
import omit from 'lodash/fp/omit';
import { yes, no, on, off } from '../utils/bools';

// Actions.

// Title.
export const UPDATE_TITLE = 'scoutdocs/doc/UPDATE_TITLE';

// Acceptance.
export const UPDATE_ACCEPTANCE = 'scoutdocs/doc/UPDATE_ACCEPTANCE';

// Readers.
export const SET_READERS = 'scoutdocs/doc/SET_READERS';
export const ADD_READER = 'scoutdocs/doc/ADD_READER';
export const REMOVE_READER = 'scoutdocs/doc/REMOVE_READER';

// Groups.
export const SET_GROUPS = 'scoutdocs/doc/SET_GROUPS';
export const ADD_GROUP = 'scoutdocs/doc/ADD_GROUP';
export const REMOVE_GROUP = 'scoutdocs/doc/REMOVE_GROUP';

// Upload percentage.
export const SET_UPLOAD_PERCENT = 'scoutdocs/doc/SET_UPLOAD_PERCENT';
export const COMPLETE_UPLOAD = 'scoutdocs/doc/COMPLETE_UPLOAD';

// Status.
export const SET_STATUS = 'scoutdocs/doc/SET_STATUS';

// Overwrite.
export const UPDATE = 'scoutdocs/doc/UPDATE';

// Initial state.
export const initialState = {
	id: 0,
	key: null,
	title: '',
	groups: [],
	readers: [],
	acceptance: false,
	author: { id: 0 },
	link: '',
	permission: '',
	status: '',
	size: '0KB',
	type: 'unknown',
	created: 0,
	modified: 0,
	uploading: no,
	percent: 100,
	prevPercent: 0,
};

// Sub-reducers.
const title = (state = initialState.title, action) => {
	switch (action.type) {
		case UPDATE_TITLE:
			return action.title;
		default:
			return state;
	}
};

const acceptance = (state = initialState.acceptance, action) => {
	switch (action.type) {
		case UPDATE_ACCEPTANCE:
			return !!action.acceptance;
		default:
			return !!state;
	}
};

const groups = (state = initialState.groups, action) => {
	switch (action.type) {
		case SET_GROUPS:
			return idList.reducer(state, idList.set(action.groups));
		case ADD_GROUP:
			return idList.reducer(state, idList.add(action.group));
		case REMOVE_GROUP:
			return idList.reducer(state, idList.remove(action.groupId));
		default:
			return state;
	}
};

const readers = (state = initialState.readers, action) => {
	switch (action.type) {
		case SET_READERS:
			return idList.reducer(state, idList.set(action.users));
		case ADD_READER:
			return idList.reducer(state, idList.add(action.user));
		case REMOVE_READER:
			return idList.reducer(state, idList.remove(action.userId));
		default:
			return state;
	}
};

const status = (state = initialState.status, action) => {
	switch (action.type) {
		case SET_STATUS:
			return action.status;
		default:
			return state;
	}
};

const percent = (state = {}, action) => {
	if (state.id === action.id) {
		switch (action.type) {
			case SET_UPLOAD_PERCENT:
				// We set uploading to true if less than 100 percent,
				// but we do NOT set it to false if it is 100 percent.
				// Why? Because Sometimes we might want a lag between
				// the percentage being 100 and the upload being
				// considered complete.
				const uploading = action.percent < 100 ? { uploading: yes } : {};
				return {
					...state,
					prevPercent: state.percent,
					percent: action.percent,
					...uploading,
				};
			case COMPLETE_UPLOAD:
				// In this case we are explicitly completing the upload.
				return {
					...state,
					prevPercent: state.percent,
					percent: 100,
					uploading: no,
				};
		}
	}

	return state;
};

const replace = (state = {}, action) => {
	if (state.id === action.id) {
		switch (action.type) {
			case UPDATE:
				const doc = omit(['created_date', 'modified_date'])({ ...action.doc });
				return { ...state, ...doc };
		}
	}

	return state;
};

const mainReducer = scoutdocsReducer(
	initialState,
	{
		groups: idList.reducer,
		readers: idList.reducer,
	},
	{
		title,
		groups,
		readers,
		acceptance,
		status,
	}
);

// Reducer.
export const reducer = reduceReducers(mainReducer, percent, replace);

export default reducer;

// Action creators.
export const updateTitle = (id, title) => ({
	type: UPDATE_TITLE,
	id,
	title,
});

export const updateAcceptance = (id, acceptance) => ({
	type: UPDATE_ACCEPTANCE,
	id,
	acceptance,
});

export const setReaders = (id, users) => ({
	type: SET_READERS,
	id,
	users,
});

export const addReader = (id, user) => ({
	type: ADD_READER,
	id,
	user,
});

export const removeReader = (id, userId) => ({
	type: REMOVE_READER,
	id,
	userId,
});

export const setGroups = (id, groups) => ({
	type: SET_GROUPS,
	id,
	groups,
});

export const addGroup = (id, group) => ({
	type: ADD_GROUP,
	id,
	group,
});

export const removeGroup = (id, groupId) => ({
	type: REMOVE_GROUP,
	id,
	groupId,
});

export const setUploadPercent = (id, percent) => ({
	type: SET_UPLOAD_PERCENT,
	id,
	percent,
});

export const completeUpload = id => ({
	type: COMPLETE_UPLOAD,
	id,
});

export const update = (id, doc) => ({
	type: UPDATE,
	id,
	doc,
});

export const setStatus = (id, status = 'read') => ({
	type: SET_STATUS,
	id,
	status,
});

// Server.
const serverActions = {
	UPDATE_TITLE: 'scoutdocs/doc/server/UPDATE_TITLE',
	UPDATE_ACCEPTANCE: 'scoutdocs/doc/server/UPDATE_ACCEPTANCE',
	SET_READERS: 'scoutdocs/doc/server/SET_READERS',
	SET_GROUPS: 'scoutdocs/doc/server/SET_GROUPS',
	VIEW: 'scoutdocs/doc/server/VIEW',
	ACCEPT: 'scoutdocs/doc/server/ACCEPT',
	REJECT: 'scoutdocs/doc/server/REJECT',
};

export const server = {
	...serverActions,

	updateTitle: (id, title) => ({
		type: serverActions.UPDATE_TITLE,
		id,
		title,
	}),

	updateAcceptance: (id, acceptance) => ({
		type: serverActions.UPDATE_ACCEPTANCE,
		id,
		acceptance,
	}),

	setReaders: (id, users) => ({
		type: serverActions.SET_READERS,
		id,
		users,
	}),

	setGroups: (id, groups) => ({
		type: serverActions.SET_GROUPS,
		id,
		groups,
	}),

	view: id => ({
		type: serverActions.VIEW,
		id,
	}),

	accept: id => ({
		type: serverActions.ACCEPT,
		id,
	}),

	decline: id => ({
		type: serverActions.DECLINE,
		id,
	}),
};
