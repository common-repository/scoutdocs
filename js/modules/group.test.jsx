import * as group from './group';
import * as user from './user';

test('updates group title', () => {
	const before = { ...group.initialState, id: 2, title: 'Foo Group' };
	const after = { ...group.initialState, id: 2, title: 'Bar Group' };
	const action = group.updateTitle(2, 'Bar Group');

	expect(group.reducer(before, action)).toMatchObject(after);
});

test('updating group 1 title does not update group 2 title', () => {
	const before = { ...group.initialState, id: 2, title: 'Foo Group' };
	const after = before;
	const action = group.updateTitle(1, 'Bar Group');

	expect(group.reducer(before, action)).toMatchObject(after);
});

test('adding user to group', () => {
	const user1 = { ...user.initialState, id: 2 };
	const user2 = { ...user.initialState, id: 3 };
	const before = { ...group.initialState, id: 5, users: [user1.id] };
	const after = { ...group.initialState, id: 5, users: [user1.id, user2.id] };
	const action = group.addUser(5, user2.id);

	expect(group.reducer(before, action)).toMatchObject(after);
});

test('removing a user from a group', () => {
	const user1 = { ...user.initialState, id: 2 };
	const user2 = { ...user.initialState, id: 3 };
	const before = { ...group.initialState, id: 5, users: [user1.id, user2.id] };
	const after = { ...group.initialState, id: 5, users: [user2.id] };
	const action = group.removeUser(5, user1.id);

	expect(group.reducer(before, action)).toMatchObject(after);
});
