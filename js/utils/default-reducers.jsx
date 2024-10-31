import defaultReducerFromInitialState from './default-reducer-from-initial-state';

export default initialState => {
	const defaultReducer = defaultReducerFromInitialState(initialState);
	const out = {};

	for (let prop in initialState) {
		out[prop] = defaultReducer(prop);
	}

	return out;
};
