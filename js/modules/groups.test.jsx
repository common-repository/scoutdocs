import * as groups from './groups';
import * as group from './group';

const firstUserId = 2;
const secondUserId = 3;
const thirdUserId = 4;

const firstGroup = {
	...group.initialState,
	id: 2,
	title: 'one',
	users: [firstUserId, secondUserId],
};
const secondGroup = {
	...group.initialState,
	id: 3,
	title: 'two',
	users: [secondUserId, thirdUserId],
};

test('adding a group to the main groups list', () => {
	const before = [firstGroup];
	const after = [firstGroup, secondGroup];
	const action = groups.add(secondGroup);

	expect(groups.reducer(before, action)).toEqual(after);
});

test('removing a group from the main groups list', () => {
	const before = [firstGroup, secondGroup];
	const after = [firstGroup];
	const action = groups.remove(secondGroup.id);

	expect(groups.reducer(before, action)).toEqual(after);
});
