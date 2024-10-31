import React, { Fragment } from 'react';
import autobind from 'class-autobind';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import isEqual from 'lodash/fp/isEqual';

import { yes, no, on, off } from '../utils/bools';

class Profile extends React.Component {
	static defaultProps = {
		user: {
			id: 0,
			name: 'Unknown User',
			email: 'unknown@example.com',
		},
		onUpdateUser() {},
	};

	static propTypes = {
		user: PropTypes.shape({
			id: PropTypes.int,
			name: PropTypes.string,
			email: PropTypes.string,
		}),
		onUpdateUser: PropTypes.func.isRequired,
	};

	state = {
		user: {
			id: this.props.user.id,
			name: this.props.user.name,
			email: this.props.user.email,
		},
		initialUser: {
			id: this.props.user.id,
			name: this.props.user.name,
			email: this.props.user.email,
		},
		updating: no,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		console.log('getDerivedStateFromProps', nextProps, prevState);
		if (
			isEqual(nextProps.user.name, prevState.initialUser.name) &&
			isEqual(nextProps.user.email, prevState.initialUser.email)
		) {
			return null;
		} else {
			const newUser = {
				name: nextProps.user.name,
				email: nextProps.user.email,
			};
			return {
				user: newUser,
				initialUser: newUser,
				updating: no,
			};
		}
	}

	handleChange(event) {
		event.preventDefault();

		const name = event.target.name;
		const value = event.target.value;

		this.setState(prevState => {
			return {
				user: { ...prevState.user, [name]: value },
			};
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({ updating: yes });
		const user = this.state.user;
		this.props.onUpdateUser({
			id: user.id,
			name: user.name,
			email: user.email,
		});
	}

	renderSaveButton() {
		if (
			this.state.user.name !== this.props.user.name ||
			this.state.user.email !== this.props.user.email ||
			this.state.updating
		) {
			if (this.state.updating) {
				return (
					<Fragment key="saving">
						<button key="saving" className="btn btn-primary" disabled>
							<FontAwesomeIcon icon="spinner" fixedWidth spin /> Saving&hellip;
						</button>
					</Fragment>
				);
			} else {
				return (
					<Fragment key="save">
						<button key="save" type="submit" className="btn btn-primary">
							Save Changes
						</button>
					</Fragment>
				);
			}
		}
	}

	render() {
		const attr = { onChange: this.handleChange };
		if (this.state.updating) {
			attr.disabled = yes;
		}
		return (
			<div className="row">
				<div className="col-6">
					<h1>Profile</h1>
					<form onChange={this.handleFormChange} onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="user-name">Name</label>
							<input
								type="text"
								className="form-control"
								id="user-name"
								placeholder="Enter name"
								name="name"
								value={this.state.user.name}
								{...attr}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="user-email">Email address</label>
							<input
								type="email"
								className="form-control"
								id="user-email"
								placeholder="Enter email address"
								name="email"
								value={this.state.user.email}
								{...attr}
							/>
						</div>
						{this.renderSaveButton()}
					</form>
				</div>
			</div>
		);
	}
}

export default Profile;
