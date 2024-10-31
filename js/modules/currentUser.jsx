import * as user from './user';
import scoutdocsReducer from '../utils/scoutdocs-reducer';

// Actions.

// Initial state.
export const initialState = {
	...user.initialState,
	key: '',
	canDoWordPressThings: false,
	canCreateUsers: false,
	nonce: '',
};

// Subreducers.
const name = (state = initialState.name, action) => {
	switch (action.type) {
		case user.UPDATE_NAME:
			return action.name;
		default:
			return state;
	}
};

const email = (state = initialState.email, action) => {
	switch (action.type) {
		case user.UPDATE_EMAIL:
			return action.email;
		default:
			return state;
	}
};

// Reducer.
export const reducer = scoutdocsReducer(
	initialState,
	{},
	{
		name,
		email,
	}
);

export default reducer;

// Server.
const serverActions = {
	UPDATE: 'scoutdocs/currentUser/server/UPDATE',
};

export const server = {
	...serverActions,

	update: (id, name, email) => ({
		type: serverActions.UPDATE,
		id,
		name,
		email,
	}),
};

// Selectors.
export const getNonce = state => state.nonce;
export const getKey = state => state.key;
