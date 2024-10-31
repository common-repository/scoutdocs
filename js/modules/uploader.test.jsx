import * as uploader from './uploader';
import { yes, no, on, off } from '../utils/bools';

const uploaderClosed = { open: no, byDrag: no };
const uploaderOpen = { open: yes, byDrag: no };
const uploaderOpenByDrag = { open: yes, byDrag: yes };

test('uploader opens', () => {
	expect(uploader.reducer(uploaderClosed, uploader.open())).toEqual(
		uploaderOpen
	);
});

test('uploader opens by drag', () => {
	expect(uploader.reducer(uploaderClosed, uploader.open(true))).toEqual(
		uploaderOpenByDrag
	);
});

test('uploader closes', () => {
	expect(uploader.reducer(uploaderOpen, uploader.close())).toEqual(
		uploaderClosed
	);
});

test('uploader closes (by drag)', () => {
	expect(uploader.reducer(uploaderOpenByDrag, uploader.close())).toEqual(
		uploaderClosed
	);
});
