// Actions.
export const OPEN = 'scoutdocs/groupManager/OPEN';
export const CLOSE = 'scoutdocs/groupManager/CLOSE';
export const TOGGLE = 'scoutdocs/groupManager/TOGGLE';

// Initial state.
export const initialState = { open: false };

// Reducer.
export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN:
			return { open: true };
		case CLOSE:
			return { open: false };
		case TOGGLE:
			return { open: !state.open };
		default:
			return state;
	}
};

export default reducer;

// Action creators.
export const open = () => ({ type: OPEN });
export const close = () => ({ type: CLOSE });
export const toggle = () => ({ type: TOGGLE });
