import * as user from './user';
import * as current from './currentUser';

test('updates user name', () => {
	const before = { ...current.initialState, id: 2, name: 'Foo' };
	const after = { ...current.initialState, id: 2, name: 'Bri' };
	const action = user.updateName(2, 'Bri');

	expect(current.reducer(before, action)).toEqual(after);
});

test('update user email', () => {
	const before = {
		...current.initialState,
		id: 3,
		email: 'before@example.com',
	};
	const after = { ...current.initialState, id: 3, email: 'after@example.com' };
	const action = user.updateEmail(3, 'after@example.com');

	expect(current.reducer(before, action)).toEqual(after);
});

test('updating user 1 name does not update user 2 name', () => {
	const before = { ...current.initialState, id: 2, name: 'Foo' };
	const after = before;
	const action = user.updateEmail(1, 'Bri');

	expect(current.reducer(before, action)).toEqual(after);
});

test('updating user 1 email does not update user 2 email', () => {
	const before = {
		...current.initialState,
		id: 2,
		email: 'before@example.com',
	};
	const after = before;
	const action = user.updateEmail(1, 'after@example.com');

	expect(current.reducer(before, action)).toEqual(after);
});
