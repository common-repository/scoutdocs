import React from 'react';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { yes, no, on, off } from '../utils/bools';

class ListItem extends React.Component {
	static defaultProps = {
		icons: [],
	};

	static propTypes = {
		icons: PropTypes.array,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	createHandleClickIcon(func) {
		return e => {
			e.preventDefault();
			return func();
		};
	}

	renderIcons() {
		if (0 === this.props.icons.length) {
			return null;
		}

		let output = this.props.icons.map(icon => {
			if (icon.onClick) {
				return (
					<a
						key={icon.icon}
						className={`action action-${icon.name}`}
						href="#/"
						onClick={this.createHandleClickIcon(icon.onClick)}
					>
						<FontAwesomeIcon fixedWidth icon={icon.icon} />
					</a>
				);
			} else {
				return (
					<span key={icon.icon} className="action">
						<FontAwesomeIcon fixedWidth icon={icon.icon} />
					</span>
				);
			}
		});

		return output;
	}

	render() {
		return (
			<li>
				{this.renderIcons()}
				<span className="info">{this.props.children}</span>
			</li>
		);
	}
}

export default ListItem;
