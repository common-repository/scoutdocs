import * as user from './user';

test('updates user name', () => {
	const before = { ...user.initialState, id: 2, name: 'Foo' };
	const after = { ...user.initialState, id: 2, name: 'Bri' };
	const action = user.updateName(2, 'Bri');

	expect(user.reducer(before, action)).toEqual(after);
});

test('update user email', () => {
	const before = { ...user.initialState, id: 3, email: 'before@example.com' };
	const after = { ...user.initialState, id: 3, email: 'after@example.com' };
	const action = user.updateEmail(3, 'after@example.com');

	expect(user.reducer(before, action)).toEqual(after);
});

test('updating user 1 name does not update user 2 name', () => {
	const before = { ...user.initialState, id: 2, name: 'Foo' };
	const after = before;
	const action = user.updateEmail(1, 'Bri');

	expect(user.reducer(before, action)).toEqual(after);
});

test('updating user 1 email does not update user 2 email', () => {
	const before = { ...user.initialState, id: 2, email: 'before@example.com' };
	const after = before;
	const action = user.updateEmail(1, 'after@example.com');

	expect(user.reducer(before, action)).toEqual(after);
});
