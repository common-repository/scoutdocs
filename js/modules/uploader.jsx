// Actions.
export const OPEN = 'scoutdocs/uploader/OPEN';
export const CLOSE = 'scoutdocs/uploader/CLOSE';
export const TOGGLE = 'scoutdocs/uploader/TOGGLE';

// Initial state.
export const initialState = {
	open: false,
	byDrag: false,
};

// Reducer.
export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN:
			return { open: true, byDrag: action.byDrag };
		case CLOSE:
			return { open: false, byDrag: false };
		case TOGGLE:
			return { open: !state.open, byDrag: false };
		default:
			return state;
	}
};

export default reducer;

// Action creators.
export const open = (byDrag = false) => ({
	type: OPEN,
	byDrag,
});

export const close = () => ({ type: CLOSE });
export const toggle = () => ({ type: TOGGLE });
