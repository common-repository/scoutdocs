import * as groupManager from './groupManager';
import { yes, no, on, off } from '../utils/bools';

const closed = { open: no };
const open = { open: yes };

test('group manager opens', () => {
	expect(groupManager.reducer(closed, groupManager.open())).toEqual(open);
});

test('group manager closes', () => {
	expect(groupManager.reducer(open, groupManager.close())).toEqual(closed);
});
