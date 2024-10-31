// Actions.
export const SET = 'scoutdocs/idList/SET';
export const ADD = 'scoutdocs/idList/ADD';
export const REMOVE = 'scoutdocs/idList/REMOVE';

// Reducer.
export const reducer = (state = [], action) => {
	switch (action.type) {
		case SET:
			return [...action.items];
		case ADD:
			return [...state, action.id];
		case REMOVE:
			return state.filter(id => id !== action.id);
		default:
			return state;
	}
};

export default reducer;

// Action creators.
export const set = items => ({ type: SET, items });
export const add = id => ({ type: ADD, id });
export const remove = id => ({ type: REMOVE, id });
