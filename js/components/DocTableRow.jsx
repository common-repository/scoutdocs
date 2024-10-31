import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import VelocityComponent from 'velocity-react/velocity-component';
import Modal from './Modal';
import ReaderChooser from '../containers/ReaderChooser';
import { Link } from 'react-router-dom';
import autobind from 'class-autobind';
import { yes, no, on, off } from '../utils/bools';
import { docIsViewed, docDate, docIcon } from '../utils/doc';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

class DocTableRow extends React.Component {
	static defaultProps = {
		onViewDoc() {},
		onUpdateTitle() {},
		canModify: no,
		canView: yes,
		totalReaders: 0,
		doc: {},
		readers: [],
	};

	static propTypes = {
		onUpdateTitle: PropTypes.func,
		canModify: PropTypes.bool,
		canView: PropTypes.bool,
		onViewDoc: PropTypes.func,
		totalReaders: PropTypes.number,
		doc: PropTypes.object,
		readers: PropTypes.arrayOf(PropTypes.number),
	};

	state = {
		isEditing: no,
		deleteModalOpen: no,
		readerChooserOpen: no,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	handleCancelReaderChooser() {
		this.setState({ readerChooserOpen: no });
	}

	handleClickReaderChooser(event) {
		event.preventDefault();
		this.setState({ readerChooserOpen: yes });
	}

	handleUpdateReaders(readers) {
		this.setState({ readerChooserOpen: no });
		this.props.onUpdateReaders(this.props.doc.id, readers);
	}

	handleUpdateGroups(groups) {
		this.setState({ readerChooserOpen: no });
		this.props.onUpdateGroups(this.props.doc.id, groups);
	}

	handleUpdateAcceptance(value) {
		this.props.onUpdateAcceptance(this.props.doc.id, value);
	}

	handleConfirmDelete() {
		this.setState({ deleteModalOpen: no });
		this.props.onDeleteDoc(this.props.doc.id);
	}

	handleCancelDelete() {
		this.setState({ deleteModalOpen: no });
	}

	handleClickDelete(event) {
		event.preventDefault();
		this.setState({ deleteModalOpen: yes });
	}

	handleClickEdit(event) {
		event.preventDefault();
		this.setState({
			isEditing: yes,
			inputTitle: this.props.doc.title,
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({ isEditing: no });
		this.props.onUpdateTitle(this.props.doc.id, this.state.inputTitle);
	}

	handleChange(event) {
		this.setState({ inputTitle: event.target.value });
	}

	handleViewDoc() {
		this.props.onViewDoc(this.props.doc.id);
	}

	renderReaderChooserPortal() {
		return createPortal(
			this.renderReaderChooser(),
			document.getElementById('modals')
		);
	}

	renderReaderChooser() {
		const doc = this.props.doc;
		return (
			<ReaderChooser
				key={doc.id}
				title={`Choose Who Can View “${doc.title}”`}
				readers={this.props.readers}
				readerGroups={doc.groups}
				showAcceptance={yes}
				omitCurrentUser={yes}
				showGroups={yes}
				docId={doc.id}
				acceptance={doc.acceptance}
				open={this.state.readerChooserOpen}
				onClose={this.handleCancelReaderChooser}
				onUpdateReaders={this.handleUpdateReaders}
				onUpdateGroups={this.handleUpdateGroups}
				onUpdateAcceptance={this.handleUpdateAcceptance}
			/>
		);
	}

	renderDeleteComfirmationPortal() {
		return createPortal(
			this.renderDeleteConfirmation(),
			document.getElementById('modals')
		);
	}

	renderDeleteConfirmation() {
		const footer = [
			<button
				key="del"
				data-focus="1"
				ref="deleteButton"
				onClick={this.handleConfirmDelete}
				type="button"
				className="doc-delete-btn btn btn-danger"
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
				open={this.state.deleteModalOpen}
				title="Confirm"
				footer={footer}
				onClose={this.handleCancelDelete}
				focusOnOpen=".doc-delete-btn"
			>
				<div className="text-center">
					<p>Are you sure you want to delete this file?</p>
					<p>
						<b>{this.props.doc.title}</b>
					</p>
				</div>
			</Modal>
		);
	}

	renderBadges() {
		const statuses = [];

		if (!docIsViewed(this.props.doc)) {
			statuses.push(
				<span key="new" className="status status-new">
					new
				</span>
			);
		}

		if (this.props.doc.acceptance && !this.props.isCurrentUserDoc) {
			const status = ['accepted', 'declined'].includes(this.props.doc.status)
				? this.props.doc.status
				: 'pending';
			statuses.push(
				<span key={status} className={`status status-${status}`}>
					{status}
				</span>
			);
		}

		return statuses;
	}

	renderReaderChooserText() {
		if (this.props.totalReaders > 0) {
			return (
				<span key="readers-exist">
					{' '}
					<span className="badge badge-secondary">
						{this.props.totalReaders}
					</span>
				</span>
			);
		} else {
			return (
				<span key="no-readers">
					{' '}
					<FontAwesomeIcon icon="plus" />
				</span>
			);
		}
	}

	renderDocumentActions() {
		if ('write' !== this.props.doc.permission) {
			return null;
		}

		if (!this.props.canModify) {
			return null;
		}

		return (
			<span className="action-links">
				<a
					title="Rename"
					className="action-edit"
					href="#/"
					onClick={this.handleClickEdit}
				>
					<FontAwesomeIcon icon="edit" />
				</a>
				<a
					title="Delete"
					className="action-delete"
					href="#/"
					onClick={this.handleClickDelete}
				>
					<FontAwesomeIcon icon="trash" />
				</a>
				<a
					title="Manage File Access"
					className="action-viewers"
					href="#/"
					onClick={this.handleClickReaderChooser}
				>
					<FontAwesomeIcon icon="users" /> {this.renderReaderChooserText()}
				</a>
			</span>
		);
	}

	renderTitle() {
		if (this.state.isEditing) {
			return (
				<td key="title-edit" className="title">
					{this.renderIcon()}
					<form onSubmit={this.handleSubmit}>
						<div className="form-row align-items-left">
							<div className="col-sm-12">
								<div className="input-group">
									<input
										autoFocus
										type="text"
										className="form-control"
										name="title"
										value={this.state.inputTitle}
										onChange={this.handleChange}
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
				</td>
			);
		} else if (this.props.canView) {
			return (
				<td key="title" className="title">
					<Link
						to={`${this.props.basePath}/${this.props.doc.id}/`}
						className="doc"
						onClick={this.handleViewDoc}
					>
						{this.renderIcon()}
						{this.renderBadges()}
						{this.props.doc.title}
						<span className="clearfix" />
					</Link>
				</td>
			);
		} else {
			return (
				<td key="title" className="title">
					<a
						href="#"
						onClick={e => {
							e.preventDefault();
						}}
						className="doc"
					>
						{this.renderIcon()}
						{this.renderBadges()}
						{this.props.doc.title}
						<span className="clearfix" />
					</a>
				</td>
			);
		}
	}

	renderIcon() {
		if (this.props.doc.uploading) {
			return (
				<div className="icon">
					<FontAwesomeIcon
						key="uploading"
						fixedWidth
						spin
						size="2x"
						icon="spinner"
					/>
				</div>
			);
		} else {
			return (
				<div className="icon">
					<FontAwesomeIcon
						key="icon"
						fixedWidth
						size="2x"
						icon={docIcon(this.props.doc)}
					/>
				</div>
			);
		}
	}

	renderUploadProgress() {
		return (
			<tr key={this.props.doc.id}>
				<td key="upload" className="upload-message" colSpan={3}>
					{this.renderIcon()}
					{this.props.doc.title}
					<br />
					<div className="progress">
						<div
							className="progress-bar progress-bar-striped progress-bar-animated"
							role="progressbar"
							aria-valuenow={this.props.doc.percent}
							aria-valuemin="0"
							aria-valuemax="100"
							style={{
								width: `${this.props.doc.percent}%`,
								transitionDuration:
									Math.max((100 - this.props.doc.prevPercent) / 100 * 2, 0.2) +
									's',
							}}
						/>
					</div>
				</td>
			</tr>
		);
	}

	renderDocRow() {
		return (
			<tr key={this.props.doc.id}>
				{this.renderTitle()}
				<td key="actions" className="actions">
					{this.renderDocumentActions()}
				</td>
				<td key="info" className="info">
					{docDate(this.props.doc.modified)}
					<br />
					<small>{this.props.doc.size}</small>
				</td>
			</tr>
		);
	}

	render() {
		let uploading = this.props.doc.uploading;
		let animationSettings = {
			animation: uploading ? { opacity: [0.5, 0] } : { opacity: [1, 0.5] },
			runOnMount: uploading,
			duration: uploading ? 1800 : 600,
		};

		return (
			<VelocityComponent {...animationSettings}>
				<Fragment>
					{this.props.doc.uploading
						? this.renderUploadProgress()
						: this.renderDocRow()}
					{this.renderDeleteComfirmationPortal()}
					{this.renderReaderChooserPortal()}
				</Fragment>
			</VelocityComponent>
		);
	}
}

export default DocTableRow;
