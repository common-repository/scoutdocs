import React, { Fragment } from 'react';
import Modal from './Modal';
import ListItem from './ListItem';
import find from 'lodash/fp/find';
import sortBy from 'lodash/fp/sortBy';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import UsersTooltip from './UsersTooltip';
import { yes, no, on, off } from '../utils/bools';

class ReaderChooser extends React.Component {
	static defaultProps = {
		onUpdateReaders() {},
		onUpdateGroups() {},
		canCreate: no,
		onUpdateAcceptance() {},
		readerLimit: 5,
		acceptance: no,
		showAcceptance: no,
		title: 'Choose Users',
		noReadersMessage: 'No users assigned',
		withStatus: no,
		showGroups: no,
		open: no,
		users: [],
		readers: [],
		activeItemsHeader: 'Users Who Can View',
		groups: [],
		readerGroups: [],
	};

	static propTypes = {
		onUpdateReaders: PropTypes.func,
		onUpdateGroups: PropTypes.func,
		canCreate: PropTypes.bool,
		onUpdateAcceptance: PropTypes.func,
		readerLimit: PropTypes.number,
		acceptance: PropTypes.bool,
		showGroups: PropTypes.bool,
		showAcceptance: PropTypes.bool,
		title: PropTypes.string,
		activeItemsHeader: PropTypes.string,
		noReadersMessage: PropTypes.string,
		withStatus: PropTypes.bool,
		open: PropTypes.bool,
		users: PropTypes.array,
		readers: PropTypes.array,
		groups: PropTypes.array,
		readerGroups: PropTypes.array,
	};

	state = {
		readers: this.props.readers,
		readerGroups: this.props.readerGroups,
		createName: '',
		createEmail: '',
		acceptance: this.props.acceptance,
		users: this.props.users,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	handleAcceptChange(event) {
		this.setState({
			acceptanceUpdated: yes,
			acceptance: event.target.checked,
		});
	}

	handleFormChange(event) {
		event.preventDefault();
		this.setState({
			[`create${event.target.name}`]: event.target.value,
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({
			createName: '',
			createEmail: '',
		});

		this.props.onCreate(this.state.createName, this.state.createEmail);
	}

	handleUpdateReaders(event) {
		event.preventDefault();
		this.props.onUpdateReaders(this.state.readers.map(r => r.id));
		this.props.onUpdateGroups(this.state.readerGroups.map(g => g.id));

		if (this.state.acceptanceUpdated) {
			this.props.onUpdateAcceptance(!!this.state.acceptance);
		}
	}

	handleAddReader(reader) {
		this.addToCollection('readers', reader);
	}

	removeById(list, id) {
		return [...list].filter(r => r.id !== id);
	}

	addToCollection(collection, item) {
		this.setState(prevState => {
			return { [collection]: [...prevState[collection], item] };
		});
	}

	handleRemoveReader(reader) {
		this.setState(prevState => {
			const readers = this.removeById(prevState.readers, reader.id);

			return { readers };
		});
	}

	handleAddGroup(group) {
		this.addToCollection('readerGroups', group);
	}

	handleRemoveGroup(readerGroup) {
		this.setState(prevState => {
			const readerGroups = this.removeById(
				prevState.readerGroups,
				readerGroup.id
			);

			return { readerGroups };
		});
	}

	getThingsNotIn(pool, selection) {
		return [...pool].filter(thing => !find({ id: thing.id })(selection));
	}

	renderCreateUser(unassignedUsers) {
		if (!this.props.canCreate) {
			return null;
		}

		let orChoose = unassignedUsers.length ? (
			<p className="or-choose">Or choose existing&hellip;</p>
		) : null;

		return (
			<Fragment>
				<form onChange={this.handleFormChange} onSubmit={this.handleSubmit}>
					<div className="form-row align-items-left">
						<div className="col-sm-12">
							<div className="input-group">
								<input
									autoFocus
									type="text"
									className="form-control"
									name="Name"
									value={this.state.createName}
									placeholder="Reader name"
								/>
								<input
									autoFocus
									type="email"
									className="form-control"
									name="Email"
									value={this.state.createEmail}
									placeholder="Reader email"
								/>
								<span className="input-group-btn">
									<button type="submit" className="btn btn-primary">
										Create
									</button>
								</span>
							</div>
						</div>
					</div>
				</form>
				{orChoose}
			</Fragment>
		);
	}

	renderReaderChooser() {
		let unassignedUsers = this.getThingsNotIn(
			this.props.users,
			this.state.readers
		);
		let unassignedGroups = this.getThingsNotIn(
			this.props.groups,
			this.state.readerGroups
		);

		let readers = sortBy('id')(this.state.readers);
		let readerGroups = sortBy('id')(this.state.readerGroups);

		const canAddReaders = readers.length < this.props.readerLimit;

		const addIcon = canAddReaders ? 'plus' : 'ban';
		const removeIcon = 'times';
		const addClickCallback = canAddReaders ? this.handleAddReader : null;

		const noReadersMessage =
			readers.length || readerGroups.length ? null : (
				<p className="no-readers">{this.props.noReadersMessage}</p>
			);

		const unassignedReaderIcons = [
			{
				icon: addIcon,
				onClick: this.handleAddReader,
				name: 'add',
			},
		];

		const assignedReaderIcons = [
			{
				icon: removeIcon,
				onClick: this.handleRemoveReader,
				name: 'remove',
			},
		];

		return (
			<div className="row">
				<div key="left" className="col-6 available">
					{this.renderCreateUser(unassignedUsers)}
					{this.props.showGroups &&
						unassignedGroups.length > 0 && (
							<Fragment>
								<h4>Groups</h4>
								<div>
									<ul className="groups">
										{unassignedGroups.map(group => {
											return (
												<ListItem
													key={group.id}
													icons={[
														{
															icon: addIcon,
															onClick: () => this.handleAddGroup(group),
															name: 'add',
														},
													]}
												>
													{group.title}
													<br />
													<UsersTooltip users={group.users}>
														<small className="group-members">
															<FontAwesomeIcon icon="users" fixedWidth />
															{`${group.users.length} user${
																group.users.length === 1 ? '' : 's'
															}`}
														</small>
													</UsersTooltip>
												</ListItem>
											);
										})}
									</ul>
								</div>
							</Fragment>
						)}
					{unassignedUsers.length > 0 &&
						unassignedGroups.length > 0 &&
						this.props.showGroups && <h4>Users</h4>}
					{unassignedUsers.length > 0 && (
						<div>
							<ul className="readers">
								{unassignedUsers.map(user => {
									return (
										<ListItem
											key={user.id}
											icons={[
												{
													icon: addIcon,
													onClick: () => this.handleAddReader(user),
													name: 'add',
												},
											]}
										>
											{user.name}
											<br />
											<small>{user.email}</small>
										</ListItem>
									);
								})}
							</ul>
						</div>
					)}
				</div>
				<div key="right" className="col-6 readers">
					<h4>{this.props.activeItemsHeader}</h4>
					{noReadersMessage}
					{readerGroups.length > 0 && (
						<div>
							<ul className="groups">
								{readerGroups.map(group => {
									return (
										<ListItem
											key={group.id}
											icons={[
												{
													icon: removeIcon,
													onClick: () => this.handleRemoveGroup(group),
													name: 'remove',
												},
											]}
										>
											{group.title}
											<br />
											<UsersTooltip users={group.users} showStatus={yes}>
												<small className="group-members">
													<FontAwesomeIcon icon="users" fixedWidth />
													{`${group.users.length} user${
														group.users.length === 1 ? '' : 's'
													}`}
												</small>
											</UsersTooltip>
										</ListItem>
									);
								})}
							</ul>
						</div>
					)}
					{readers.length > 0 && (
						<div>
							<ul className="readers">
								{readers.map(reader => {
									const status = reader.status || 'unread';
									return (
										<ListItem
											key={reader.id}
											icons={[
												{
													icon: removeIcon,
													onClick: () => this.handleRemoveReader(reader),
													name: 'remove',
												},
											]}
										>
											{this.props.withStatus && (
												<span
													key={status}
													className={`status status-${status}`}
												>
													{status}
												</span>
											)}
											{reader.name}
											<br />
											<small>{reader.email}</small>
										</ListItem>
									);
								})}
							</ul>
						</div>
					)}
				</div>
			</div>
		);
	}

	render() {
		const footer = [];
		if (this.props.showAcceptance) {
			footer.push(
				<div
					key="acceptance"
					className="form-check form-check-inline mr-auto align-self-center"
				>
					<label className="form-check-label">
						<input
							className="form-check-input"
							type="checkbox"
							value="1"
							checked={this.state.acceptance}
							onChange={this.handleAcceptChange}
						/>{' '}
						Ask users to accept or decline this file
					</label>
				</div>
			);
		}

		footer.push(
			<button
				key="save"
				onClick={this.handleUpdateReaders}
				type="button"
				className="btn btn-primary"
			>
				Save
			</button>,
			<button
				key="cancel"
				type="button"
				className="btn btn-secondary"
				data-dismiss="modal"
			>
				Cancel
			</button>
		);

		return (
			<Modal
				open={this.props.open}
				title={this.props.title}
				footer={footer}
				onClose={this.props.onClose}
				large={yes}
				className="reader-chooser"
			>
				<div className="container-fluid">{this.renderReaderChooser()}</div>
			</Modal>
		);
	}
}

export default ReaderChooser;
