import React from 'react';
import NavItem from './NavItem';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { yes, no, on, off } from '../utils/bools';

class TopNav extends React.Component {
	static defaultProps = {
		onAddClick() {},
		onGroupManageClick() {},
		canUpload: no,
		newDocs: 0,
		uploaderOpen: no,
		version: 0,
		centerItems: [],
		sdLogoUrl: '',
		urls: {},
		user: {},
		text: {},
	};

	static propTypes = {
		onAddClick: PropTypes.func,
		onGroupManageClick: PropTypes.func,
		canUpload: PropTypes.bool,
		newDocs: PropTypes.number,
		uploaderOpen: PropTypes.bool,
		version: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		centerItems: PropTypes.node,
		sdLogoUrl: PropTypes.string,
		urls: PropTypes.object,
		user: PropTypes.object,
		text: PropTypes.object,
	};

	handleAddClick(e) {
		e.preventDefault();
		return this.props.onAddClick();
	}

	handleGroupManageClick(e) {
		e.preventDefault();
		return this.props.onGroupManageClick();
	}

	constructor() {
		super(...arguments);
		autobind(this);
	}

	render() {
		return (
			<nav id="top-nav">
				<div className="collapse navbar-collapse justify-content-between">
					<ul className="navbar-nav mr-auto">
						<NavItem
							to={this.props.urls.scoutdocsPath + '/'}
							active={yes}
							className="main"
						>
							<img src={this.props.sdLogoUrl} className="sd-logo" />
							<span>{this.props.text.pageTitle}</span>
						</NavItem>

						{this.props.newDocs > 0 && (
							<NavItem
								to={`${this.props.urls.scoutdocsPath}/new/`}
								className="d-none d-md-inline"
							>
								<span className="badge badge-primary">
									{this.props.newDocs} {this.props.text.newDocs}
								</span>
							</NavItem>
						)}

						{this.props.user.canCreateUsers && (
							<NavItem
								href="#groups"
								className="groups"
								onClick={this.handleGroupManageClick}
							>
								Groups
							</NavItem>
						)}
					</ul>
					<ul className="navbar-center">{this.props.centerItems}</ul>

					<ul className="navbar-nav">
						{this.props.user.canDoWordPressThings && (
							<NavItem
								href={this.props.urls.admin}
								className="back-to-wordpress"
							>
								<FontAwesomeIcon icon="chevron-left" />
								<FontAwesomeIcon icon={['fab', 'wordpress-simple']} />
							</NavItem>
						)}

						<NavItem
							to={this.props.urls.scoutdocsPath + '/profile/'}
							className="profile"
						>
							<FontAwesomeIcon icon="user" />
							<span>{this.props.user.name}</span>
						</NavItem>

						<NavItem href={this.props.urls.logOut} className="logout">
							<FontAwesomeIcon icon="sign-out-alt" />
							<span>{this.props.text.logOut}</span>
						</NavItem>
					</ul>
				</div>
			</nav>
		);
	}
}

export default TopNav;
