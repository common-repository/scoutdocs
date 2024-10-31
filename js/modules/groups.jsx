import group from './group';

// Actions.
export const ADD = 'scoutdocs/groups/ADD';
export const REMOVE = 'scoutdocs/groups/REMOVE';

// Reducer.
export const reducer = (state = [], action) => {
	switch (action.type) {
		case ADD:
			return [...state, action.group];
		case REMOVE:
			return state.filter(g => g.id !== action.id);
		default:
			return state.map(g => group(g, action));
	}
};

export default reducer;

// Action creators.
export const add = group => ({ type: ADD, group });
export const remove = id => ({ type: REMOVE, id });

// Server.
const serverActions = {
	CREATE: 'scoutdocs/groups/server/CREATE',
	REMOVE: 'scoutdocs/groups/server/REMOVE',
};

export const server = {
	...serverActions,

	create: title => ({
		type: serverActions.CREATE,
		title,
	}),

	remove: id => ({
		type: serverActions.REMOVE,
		id,
	}),
};

// Selectors.
export const getGroup = (state, id) => {
	return state.find(group => id === group.id);
};
