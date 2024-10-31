import React, { Fragment } from 'react';
import DocTableRow from '../containers/DocTableRow';
import VelocityTransitionGroup from 'velocity-react/velocity-transition-group';
import bsn from 'bootstrap.native/dist/bootstrap-native-v4';
import autobind from 'class-autobind';
import find from 'lodash/fp/find';
import PropTypes from 'prop-types';
import { yes, no, on, off } from '../utils/bools';
import isEqual from 'lodash/fp/isEqual';

class DocTable extends React.Component {
	static defaultProps = {
		onNavigateToPage() {},
		docs: [],
		totalDocs: 0,
		animate: yes,
		readerLimit: 1,
		perPage: 1000,
		page: 1,
		canUpload: no,
	};

	static propTypes = {
		onNavigateToPage: PropTypes.func,
		docs: PropTypes.array,
		totalDocs: PropTypes.number,
		animate: PropTypes.bool,
		readerLimit: PropTypes.number,
		perPage: PropTypes.number,
		page: PropTypes.number,
		canUpload: PropTypes.bool,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	handleClickPreviousPage(event) {
		event.preventDefault();
		this.props.onNavigateToPage(Math.max(1, this.props.page - 1));
	}

	handleClickNextPage(event) {
		event.preventDefault();
		this.props.onNavigateToPage(
			Math.min(this.totalPages(), this.props.page + 1)
		);
	}

	totalPages() {
		return Math.max(Math.ceil(this.props.totalDocs / this.props.perPage), 1);
	}

	renderPagination() {
		if (!this.props.docs.length || this.totalPages() < 2) {
			return null;
		}

		let prevDisabled = this.props.page - 1 < 1 ? 'disabled' : '';
		let nextDisabled =
			this.props.page + 1 > this.totalPages() ? 'disabled' : '';

		return (
			<Fragment>
				<p className="text-center">
					Page {this.props.page} / {this.totalPages()}
				</p>
				<nav aria-label="Page navigation">
					<ul className="pagination justify-content-center">
						<li className={`page-item ${prevDisabled}`}>
							<a
								className="page-link"
								href="#"
								onClick={this.handleClickPreviousPage}
							>
								&larr; Previous
							</a>
						</li>
						<li className={`page-item ${nextDisabled}`}>
							<a
								className="page-link"
								href="#"
								onClick={this.handleClickNextPage}
							>
								Next &rarr;
							</a>
						</li>
					</ul>
				</nav>
			</Fragment>
		);
	}

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.animate !== this.props.animate ||
			!isEqual(nextProps.docs, this.props.docs)
		);
	}

	render() {
		if (!this.props.docs.length) {
			let message = this.props.canUpload
				? 'No files uploaded'
				: 'No files assigned to you';
			return (
				<Fragment>
					<h1 className="text-center">{message}</h1>
				</Fragment>
			);
		}

		let leave = this.props.animate
			? { animation: { scaleX: [0, 1] }, duration: 600 }
			: null;
		return (
			<Fragment>
				<table className="docs">
					<VelocityTransitionGroup component="tbody" leave={leave}>
						{this.props.docs.map(({ key, id }) => (
							<DocTableRow key={key || id} docId={id} />
						))}
					</VelocityTransitionGroup>
				</table>
				{this.renderPagination()}
			</Fragment>
		);
	}
}

export default DocTable;
