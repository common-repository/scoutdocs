import * as idList from './idList';
import * as user from './user';

const firstId = 2;
const secondId = 3;

test('adding an ID to a ID list', () => {
	const before = [firstId];
	const after = [firstId, secondId];
	const action = idList.add(secondId);

	expect(idList.reducer(before, action)).toEqual(after);
});

test('removing an ID from a ID list', () => {
	const before = [firstId, secondId];
	const after = [firstId];
	const action = idList.remove(secondId);

	expect(idList.reducer(before, action)).toEqual(after);
});

test('setting an ID list', () => {
	const before = [firstId, secondId];
	const after = [firstId];
	const action = idList.set([firstId]);

	expect(idList.reducer(before, action)).toEqual(after);
});
