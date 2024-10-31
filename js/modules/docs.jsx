import * as doc from './doc';

// Actions.
const ADD = 'scoutdocs/docs/ADD';
const REMOVE = 'scoutdocs/docs/REMOVE';

// Reducer.
export const reducer = (state = [], action) => {
	switch (action.type) {
		case ADD:
			return [{ ...doc.initialState, ...action.doc }, ...state];
		case REMOVE:
			return state.filter(d => d.id !== action.id);
		default:
			return state.map(d => doc.reducer(d, action));
	}
};

export default reducer;

// Action creators.
export const add = doc => ({ type: ADD, doc });
export const remove = id => ({ type: REMOVE, id });

// Server.
const serverActions = {
	ADD_FILES: 'scoutdocs/docs/server/ADD_FILES',
	REMOVE: 'scoutdocs/docs/server/REMOVE',
};

export const server = {
	...serverActions,

	addFiles: files => ({
		type: serverActions.ADD_FILES,
		files,
	}),

	remove: id => ({
		type: serverActions.REMOVE,
		id,
	}),
};

// Selectors.
export const getDoc = (state, id) => {
	return state.find(doc => id === doc.id);
};
