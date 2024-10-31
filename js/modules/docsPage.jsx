// Actions.
export const GO_TO_PAGE = 'scoutdocs/docsPage/GO_TO_PAGE';

// Initial state.
export const initialState = 1;

// Reducer.
export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case GO_TO_PAGE:
			return Math.max(+action.page, 1);
		default:
			return state;
	}
};

export default reducer;

// Action creators.
export const goToPage = (page = 1) => ({
	type: GO_TO_PAGE,
	page,
});
