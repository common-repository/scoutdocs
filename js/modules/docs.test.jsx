import * as docs from './docs';
import * as doc from './doc';

const firstDoc = { ...doc.initialState, id: 1, title: 'doc one' };
const secondDoc = { ...doc.initialState, id: 2, title: 'doc two' };

test('adding a doc', () => {
	const before = [firstDoc];
	const after = [secondDoc, firstDoc];
	const action = docs.add(secondDoc);

	expect(docs.reducer(before, action)).toEqual(after);
});

test('removing a doc', () => {
	const before = [firstDoc, secondDoc];
	const after = [secondDoc];
	const action = docs.remove(firstDoc.id);

	expect(docs.reducer(before, action)).toEqual(after);
});
