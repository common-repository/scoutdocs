// Actions.
export const START_ANIMATING = 'scoutdocs/animateDocRows/START_ANIMATING';
export const STOP_ANIMATING = 'scoutdocs/animateDocRows/STOP_ANIMATING';

// Reducer.

export const reducer = (state = false, action) => {
	switch (action.type) {
		case START_ANIMATING:
			return true;
		case STOP_ANIMATING:
			return false;
		default:
			return state;
	}
};

export default reducer;

// Action creators.
export const startAnimating = () => ({
	type: START_ANIMATING,
});

export const stopAnimating = () => ({
	type: STOP_ANIMATING,
});
