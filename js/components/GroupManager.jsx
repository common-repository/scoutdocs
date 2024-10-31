import React, { Fragment } from 'react';
import Modal from './Modal';
import ReaderChooser from '../containers/ReaderChooser';
import ListItem from './ListItem';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import UsersTooltip from '../containers/UsersTooltip';
import { yes, no, on, off } from '../utils/bools';

class GroupManager extends React.Component {
	static defaultProps = {
		onUpdateReaders() {},
		onUpdateGroups() {},
		canCreate() {},
		onCreate() {},
		onUpdateTitle() {},
		onDelete() {},
		onClose() {},
		groups: [],
		open: no,
	};

	static propTypes = {
		onUpdateReaders: PropTypes.func,
		onUpdateGroups: PropTypes.func,
		canCreate: PropTypes.bool,
		onCreate: PropTypes.func,
		onUpdateTitle: PropTypes.func,
		onDelete: PropTypes.func,
		onClose: PropTypes.func,
		groups: PropTypes.array.isRequired,
		open: PropTypes.bool,
	};

	state = {
		group: null,
		createName: '',
		editGroup: null,
		editName: '',
		deleteGroup: null,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	resetState() {
		this.setState({
			group: null,
			createName: '',
			editGroup: null,
			editName: '',
			deleteGroup: null,
		});
	}

	handleClickDelete(group) {
		this.setState({ deleteGroup: group });
	}

	handleConfirmDelete() {
		this.props.onDelete(this.state.deleteGroup.id);
		this.setState({ deleteGroup: null });
	}

	handleCancelDelete() {
		this.setState({ deleteGroup: null });
	}

	handleUpdateReaders(readers) {
		console.log('handleUpdateReaders GM Component', readers);
		const group = this.state.group;
		this.resetState();
		this.props.onUpdateReaders(group.id, readers);
	}

	handleClose() {
		this.resetState();
		this.props.onClose();
	}

	handleChooseGroup(group) {
		this.setState({
			group: group,
		});
	}

	handleClickEditGroup(group) {
		this.setState({
			editGroup: group,
			editName: group.title,
		});
	}

	handleCreateFormChange(event) {
		event.preventDefault();
		this.setState({
			[`create${event.target.name}`]: event.target.value,
		});
	}

	handleCreateFormSubmit(event) {
		event.preventDefault();

		const create = this.props.onCreate(this.state.createName);

		this.setState({
			createName: '',
		});
	}

	handleEditFormChange(event) {
		event.preventDefault();
		this.setState({
			[`edit${event.target.name}`]: event.target.value,
		});
	}

	handleEditFormSubmit(event) {
		event.preventDefault();
		this.props.onUpdateTitle(this.state.editGroup.id, this.state.editName);
		this.resetState();
	}

	handleAddGroup(group) {
		this.setState(prevState => {
			const groups = [...prevState.groups, group];

			return { groups };
		});
	}

	renderCreateGroup() {
		return (
			<Fragment>
				<form onSubmit={this.handleCreateFormSubmit}>
					<div className="form-row align-items-left">
						<div className="col-sm-12">
							<div className="input-group">
								<input
									autoFocus
									type="text"
									className="form-control"
									name="Name"
									value={this.state.createName}
									placeholder="Group name"
									onChange={this.handleCreateFormChange}
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
			</Fragment>
		);
	}

	renderEditGroup() {
		return (
			<Fragment>
				<form onSubmit={this.handleEditFormSubmit}>
					<div className="form-row align-items-left">
						<div className="col-sm-12">
							<div className="input-group">
								<input
									autoFocus
									type="text"
									className="form-control"
									name="Name"
									value={this.state.editName}
									placeholder="Group name"
									onChange={this.handleEditFormChange}
								/>
								<span className="input-group-btn">
									<button type="submit" className="btn btn-primary">
										Save
									</button>
								</span>
							</div>
						</div>
					</div>
				</form>
			</Fragment>
		);
	}

	renderGroupChooser() {
		return (
			<div className="row">
				<div key="groups" className="col-8 offset-2 groups">
					{this.state.editGroup && this.renderEditGroup()}
					{!this.state.editGroup && this.renderCreateGroup()}
					{!this.state.editGroup && (
						<div>
							<ul key="groups" className="groups">
								{this.props.groups.map(group => {
									return (
										<ListItem
											key={group.id}
											icons={[
												{
													icon: 'edit',
													onClick: () => this.handleClickEditGroup(group),
													name: 'edit',
												},
												{
													icon: 'trash',
													onClick: () => this.handleClickDelete(group),
													name: 'delete',
												},
												{
													icon: 'users',
													onClick: () => this.handleChooseGroup(group),
													name: 'choose',
												},
											]}
										>
											{group.title}
											<br />
											<UsersTooltip userIds={group.users}>
												<small className="group-members">{`${
													group.users.length
												} user${group.users.length === 1 ? '' : 's'}`}</small>
											</UsersTooltip>
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

	renderConfirmation() {
		const footer = [
			<button
				key="del"
				data-focus="1"
				ref="deleteButton"
				onClick={this.handleConfirmDelete}
				type="button"
				className="group-delete-btn btn btn-danger"
			>
				Delete
			</button>,
			<button
				key="cancel"
				type="button"
				className="btn btn-secondary"
				onClick={this.handleCancelDelete}
			>
				Cancel
			</button>,
		];

		return (
			<Modal
				key="confirmDelete"
				open={!!this.props.open && !!this.state.deleteGroup}
				title="Confirm"
				footer={footer}
				onClose={this.handleCancelDelete}
				focusOnOpen=".group-delete-btn"
			>
				<div className="text-center">
					<p>Are you sure you want to delete this group?</p>
					<p>
						<b>{this.state.deleteGroup.title}</b>
					</p>
				</div>
			</Modal>
		);
	}

	renderGroupManager() {
		const group = this.state.group;
		const title = group ? group.title : '';
		const readers = group ? group.users : [];

		return (
			<ReaderChooser
				readerLimit={this.props.readerLimit}
				title={`Choose Members for “${title}”`}
				readers={readers}
				showAcceptance={no}
				showGroups={no}
				activeItemsHeader="Group Members"
				open={this.props.open && !!group}
				onClose={this.resetState}
				onUpdateReaders={this.handleUpdateReaders}
				withStatus={no}
			/>
		);
	}

	render() {
		if (this.state.group) {
			return this.renderGroupManager();
		} else if (this.state.deleteGroup) {
			return this.renderConfirmation();
		} else {
			return (
				<Modal
					key="groupChooser"
					open={this.props.open && !this.state.group}
					title="Groups"
					onClose={this.handleClose}
					large={yes}
					className="reader-chooser"
				>
					<div className="container-fluid">{this.renderGroupChooser()}</div>
				</Modal>
			);
		}
	}
}

export default GroupManager;
