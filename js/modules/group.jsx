import * as idList from './idList';
import scoutdocsReducer from '../utils/scoutdocs-reducer';

// Actions.
export const UPDATE_TITLE = 'scoutdocs/group/UPDATE_TITLE';
export const ADD_USER = 'scoutdocs/group/ADD_USER';
export const REMOVE_USER = 'scoutdocs/group/REMOVE_USER';
export const SET_USERS = 'scoutdocs/group/SET_USERS';

// Initial state.
export const initialState = { id: 0, title: '', users: [] };

// Subreducers.
const title = (state = initialState.title, action) => {
	switch (action.type) {
		case UPDATE_TITLE:
			return action.title;
		default:
			return state;
	}
};

const users = (state = initialState.users, action) => {
	switch (action.type) {
		case SET_USERS:
			return idList.reducer(state, idList.set(action.users));
		case ADD_USER:
			return idList.reducer(state, idList.add(action.userId));
		case REMOVE_USER:
			return idList.reducer(state, idList.remove(action.userId));
		default:
			return state;
	}
};

// Reducer.
export const reducer = scoutdocsReducer(
	initialState,
	{
		users: idList.reducer,
	},
	{
		title,
		users,
	}
);

export default reducer;

// Action creators.
export const updateTitle = (id, title) => ({
	type: UPDATE_TITLE,
	id,
	title,
});

export const addUser = (id, userId) => ({ type: ADD_USER, id, userId });

export const removeUser = (id, userId) => ({
	type: REMOVE_USER,
	id,
	userId,
});

export const setUsers = (id, users) => ({
	type: SET_USERS,
	id,
	users,
});

// Server.
const serverActions = {
	UPDATE_TITLE: 'scoutdocs/group/server/UPDATE_TITLE',
	SET_USERS: 'scoutdocs/group/server/SET_USERS',
};

export const server = {
	...serverActions,

	updateTitle: (id, title) => ({
		type: serverActions.UPDATE_TITLE,
		id,
		title,
	}),

	setUsers: (id, userIds) => ({
		type: serverActions.SET_USERS,
		id,
		userIds,
	}),
};
