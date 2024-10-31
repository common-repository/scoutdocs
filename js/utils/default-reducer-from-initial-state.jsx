export default initialState => {
	return prop => {
		const def = initialState.hasOwnProperty(prop) ? initialState[prop] : null;
		return (state = def) => state;
	};
};
