import * as animate from './animateDocRows';

test('animation turns on', () => {
	expect(animate.reducer(false, animate.startAnimating())).toBe(true);
});

test('animation turns off', () => {
	expect(animate.reducer(true, animate.stopAnimating())).toBe(false);
});

test('animation stays on', () => {
	expect(animate.reducer(true, animate.startAnimating())).toBe(true);
});

test('animation stays off', () => {
	expect(animate.reducer(false, animate.stopAnimating())).toBe(false);
});
