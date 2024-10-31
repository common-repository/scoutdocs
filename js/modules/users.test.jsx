import * as users from './users';
import * as user from './user';

test('updates user name in user list', () => {
	const before = [{ ...user.initialState, id: 2, name: 'Foo' }];
	const after = [{ ...user.initialState, id: 2, name: 'Bri' }];
	const action = user.updateName(2, 'Bri');

	expect(users.reducer(before, action)).toEqual(after);
});

test('update user email in user list', () => {
	const before = [{ ...user.initialState, id: 3, email: 'before@example.com' }];
	const after = [{ ...user.initialState, id: 3, email: 'after@example.com' }];
	const action = user.updateEmail(3, 'after@example.com');

	expect(users.reducer(before, action)).toEqual(after);
});

test('updating user 1 name does not update user 2 name in user list', () => {
	const before = [{ ...user.initialState, id: 2, name: 'Foo' }];
	const after = before;
	const action = user.updateEmail(1, 'Bri');

	expect(users.reducer(before, action)).toEqual(after);
});

test('updating user 1 email does not update user 2 email in user list', () => {
	const before = [{ ...user.initialState, id: 2, email: 'before@example.com' }];
	const after = before;
	const action = user.updateEmail(1, 'after@example.com');

	expect(users.reducer(before, action)).toEqual(after);
});

test('adding a user to the main users list', () => {
	const firstUser = { ...user.initialState, id: 2, name: 'one' };
	const secondUser = { ...user.initialState, id: 3, name: 'two' };
	const before = [firstUser];
	const after = [firstUser, secondUser];
	const action = users.add(secondUser);

	expect(users.reducer(before, action)).toEqual(after);
});

test('removing a user from the main users list', () => {
	const firstUser = { ...user.initialState, id: 2, name: 'one' };
	const secondUser = { ...user.initialState, id: 3, name: 'two' };
	const before = [firstUser, secondUser];
	const after = [firstUser];
	const action = users.remove(secondUser.id);

	expect(users.reducer(before, action)).toEqual(after);
});
