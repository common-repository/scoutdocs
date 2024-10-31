import React from 'react';
import VelocityComponent from 'velocity-react/velocity-component';
import autobind from 'class-autobind';

class ScoutDocsVelocity extends React.Component {
	constructor() {
		super(...arguments);
		autobind(this);
	}

	begin(elements) {
		if ('slideDown' === this.props.animation) {
			elements
				.filter(el => 'none' === el.style.display)
				.forEach(el => (el.style.height = null));
		}
	}

	render() {
		const props = Object.assign({}, this.props, { begin: this.begin });
		return (
			<VelocityComponent {...props}>{this.props.children}</VelocityComponent>
		);
	}
}

export default ScoutDocsVelocity;
