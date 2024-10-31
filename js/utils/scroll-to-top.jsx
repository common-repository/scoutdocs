import Velocity from 'velocity-animate';

export default function scrollToTop() {
	Velocity(document.body, 'scroll', { duration: 300 });
}
