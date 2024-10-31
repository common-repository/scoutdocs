import * as selectors from './selectors';
import * as group from './modules/group';
import * as doc from './modules/doc';
import * as currentUser from './modules/currentUser';

const state = {
	groups: [
		{ ...group.initialState, id: 45, users: [1, 2, 3] },
		{ ...group.initialState, id: 46, users: [3, 4, 5] },
	],
	docs: [
		{ ...doc.initialState, id: 1, readers: [1, 2], groups: [45] },
		{ ...doc.initialState, id: 2, readers: [9], groups: [45, 46] },
		{ ...doc.initialState, id: 3, readers: [], groups: [45] },
	],
	user: {
		...currentUser.initialState,
		id: 2,
	},
};

test('gets user IDs from a group', () => {
	expect(selectors.getGroupUserIds(state, 45)).toEqual([1, 2, 3]);
});

test('gets user IDs from a doc', () => {
	expect(selectors.getAllDocReaders(state, 1)).toEqual([1, 3]);
});

test('gets user IDs from a doc', () => {
	expect(selectors.getAllDocReaders(state, 2)).toEqual([1, 3, 4, 5, 9]);
});

test('gets user IDs from a doc', () => {
	expect(selectors.getAllDocReaders(state, 3)).toEqual([1, 3]);
});

test('gets user ID length from a doc', () => {
	expect(selectors.getTotalDocReaders(state, 2)).toEqual(5);
});
