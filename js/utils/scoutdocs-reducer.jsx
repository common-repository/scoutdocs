import defaultReducers from '../utils/default-reducers';
import { combineReducers } from 'redux';

export default (initialState, normalReducers, idMatchReducers) => {
	return (state = initialState, action) => {
		let reducers = {
			...defaultReducers(initialState),
			...normalReducers,
		};

		if (state.id === action.id) {
			reducers = {
				...reducers,
				...idMatchReducers,
			};
		}

		return combineReducers(reducers)(state, action);
	};
};
