import scoutdocsReducer from '../utils/scoutdocs-reducer';

// Actions.
export const UPDATE_NAME = 'scoutdocs/user/UPDATE_NAME';
export const UPDATE_EMAIL = 'scoutdocs/user/UPDATE_EMAIL';

// Initial state.
export const initialState = {
	id: 0,
	name: '',
	email: '',
	username: '',
};

// Subreducers.
const name = (state = initialState.name, action) => {
	switch (action.type) {
		case UPDATE_NAME:
			return action.name;
		default:
			return state;
	}
};

const email = (state = initialState.email, action) => {
	switch (action.type) {
		case UPDATE_EMAIL:
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

// Action creators.
export const updateEmail = (id, email) => ({
	type: UPDATE_EMAIL,
	id,
	email,
});

export const updateName = (id, name) => ({
	type: UPDATE_NAME,
	id,
	name,
});
