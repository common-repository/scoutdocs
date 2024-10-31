import * as docsPage from './docsPage';

test('navigate to page 2', () => {
	expect(docsPage.reducer(1, docsPage.goToPage(2))).toBe(2);
});

test('navigate to page 0', () => {
	expect(docsPage.reducer(2, docsPage.goToPage(0))).toBe(1);
});

test('navigate to page -1', () => {
	expect(docsPage.reducer(2, docsPage.goToPage(-1))).toBe(1);
});

test('navigate to page null', () => {
	expect(docsPage.reducer(2, docsPage.goToPage(null))).toBe(1);
});

test('navigate to page undefined', () => {
	expect(docsPage.reducer(2, docsPage.goToPage())).toBe(1);
});
