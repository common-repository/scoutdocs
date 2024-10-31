import user from './user';

// Actions.
const ADD = 'scoutdocs/users/ADD';
const REMOVE = 'scoutdocs/users/REMOVE';

// Reducer.
export const reducer = (state = [], action) => {
	switch (action.type) {
		case ADD:
			return [...state, action.user];
		case REMOVE:
			return state.filter(u => u.id !== action.id);
		default:
			return state.map(u => user(u, action));
	}
};

export default reducer;

// Action creators.
export const add = user => ({ type: ADD, user });
export const remove = id => ({ type: REMOVE, id });

// Server.
const serverActions = {
	CREATE: 'scoutdocs/users/server/CREATE',
};

export const server = {
	...serverActions,

	create: (name, email) => ({
		type: serverActions.CREATE,
		name,
		email,
	}),
};

// Selectors.
export const getUser = (state, id) => {
	return state.find(u => id === u.id);
};
