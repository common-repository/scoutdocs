import * as doc from './doc';
import * as user from './user';
import * as group from './group';

const firstUser = {
	...user.initialState,
	id: 2,
	name: 'user one',
	email: 'one@example.com',
};
const secondUser = {
	...user.initialState,
	id: 3,
	name: 'user two',
	email: 'two@example.com',
};
const thirdUser = {
	...user.initialState,
	id: 4,
	name: 'user three',
	email: 'three@example.com',
};

const firstGroup = {
	...group.initialState,
	id: 2,
	title: 'one',
	users: [firstUser.id, secondUser.id],
};
const secondGroup = {
	...group.initialState,
	id: 3,
	title: 'two',
	users: [secondUser.id, thirdUser.id],
};

test('updates doc title', () => {
	const before = {
		...doc.initialState,
		id: 7,
		title: 'foo',
	};
	const after = {
		...before,
		title: 'bar',
	};
	const action = doc.updateTitle(7, 'bar');

	expect(doc.reducer(before, action)).toEqual(after);
});

test('updates doc acceptance', () => {
	const before = {
		...doc.initialState,
		id: 7,
		acceptance: false,
	};
	const after = {
		...before,
		acceptance: true,
	};
	const action = doc.updateAcceptance(7, 1);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('adds doc reader', () => {
	const before = {
		...doc.initialState,
		id: 7,
		readers: [firstUser.id],
	};
	const after = {
		...before,
		readers: [firstUser.id, secondUser.id],
	};
	const action = doc.addReader(7, secondUser.id);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('removes doc reader', () => {
	const before = {
		...doc.initialState,
		id: 7,
		readers: [firstUser.id, secondUser.id],
	};
	const after = {
		...before,
		readers: [secondUser.id],
	};
	const action = doc.removeReader(7, firstUser.id);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('adds doc group', () => {
	const before = {
		...doc.initialState,
		id: 7,
		groups: [firstGroup.id],
	};
	const after = {
		...before,
		groups: [firstGroup.id, secondGroup.id],
	};
	const action = doc.addGroup(7, secondGroup.id);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('removes doc group', () => {
	const before = {
		...doc.initialState,
		id: 7,
		groups: [firstGroup.id, secondGroup.id],
	};
	const after = {
		...before,
		groups: [secondGroup.id],
	};
	const action = doc.removeGroup(7, firstUser.id);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('sets doc readers', () => {
	const before = {
		...doc.initialState,
		id: 7,
		readers: [firstUser.id, secondUser.id],
	};
	const after = {
		...before,
		readers: [secondUser.id],
	};
	const action = doc.setReaders(7, [secondUser.id]);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('sets doc groups', () => {
	const before = {
		...doc.initialState,
		id: 7,
		groups: [firstGroup.id, secondGroup.id],
	};
	const after = {
		...before,
		groups: [secondGroup.id],
	};
	const action = doc.setGroups(7, [secondGroup.id]);

	expect(doc.reducer(before, action)).toEqual(after);
});

test('sets doc upload percentage', () => {
	const before = {
		...doc.initialState,
		id: 7,
	};
	const after = {
		...before,
		uploading: true,
		prevPercent: before.percent,
		percent: 33,
	};
	const action = doc.setUploadPercent(7, 33);

	expect(doc.reducer(before, action)).toEqual(after);
});
