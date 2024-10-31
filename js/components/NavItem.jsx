import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { yes, no, on, off } from '../utils/bools';

const propTypeClassname = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.array,
]);

class NavItem extends React.Component {
	static defaultProps = {
		href: '#',
		className: '',
		active: no,
		linkClasses: ['nav-link'],
		onClick() {},
	};

	static propTypes = {
		href: PropTypes.string,
		className: propTypeClassname,
		active: PropTypes.bool,
		linkClasses: propTypeClassname,
		onClick: PropTypes.func,
	};

	getClassNames() {
		return [
			{
				'nav-item': yes,
				active: this.props.active,
			},
			this.props.className,
		];
	}

	interposeSpaces(children) {
		return React.Children.map(children, (child, i) => {
			const maybeSpace = i < 1 ? '' : ' ';
			return (
				<Fragment>
					{maybeSpace}
					{child}
				</Fragment>
			);
		});
	}

	renderLink() {
		if (this.props.to) {
			return (
				<Link
					className={classNames(this.props.linkClasses)}
					to={this.props.to}
					onClick={this.props.onClick}
				>
					{this.interposeSpaces(this.props.children)}
				</Link>
			);
		} else {
			return (
				<a
					className={classNames(this.props.linkClasses)}
					href={this.props.href}
					onClick={this.props.onClick}
				>
					{this.interposeSpaces(this.props.children)}
				</a>
			);
		}
	}

	render() {
		return (
			<li className={classNames(this.getClassNames())}>{this.renderLink()}</li>
		);
	}
}

export default NavItem;
