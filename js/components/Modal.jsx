import React from 'react';
import bsn from 'bootstrap.native/dist/bootstrap-native-v4';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { yes, no, on, off } from '../utils/bools';

class Modal extends React.Component {
	static defaultProps = {
		onClose() {},
		small: no,
		large: no,
		className: '',
		footer: [],
		closable: yes,
		focusOnOpen: '',
		open: no,
	};

	static propTypes = {
		onClose: PropTypes.func,
		small: PropTypes.bool,
		large: PropTypes.bool,
		className: PropTypes.string,
		footer: PropTypes.array,
		closable: PropTypes.bool,
		focusOnOpen: PropTypes.string,
		open: PropTypes.bool,
	};

	componentWillReceiveProps(props) {
		// Show if the 'open' prop has changed to open.
		if (props.open && !this.props.open) {
			this.modal.show();
		}

		// Hide if the 'open' prop has changed to closed.
		if (!props.open && this.props.open) {
			this.modal.hide();
		}
	}

	componentDidMount() {
		var options = {};

		if (!this.props.closable) {
			options.backdrop = 'static';
			options.keyboard = false;
		}

		this.modal = new bsn.Modal(this.refs.modal, options);
		this.refs.modal.addEventListener(
			'hidden.bs.modal',
			this.props.onClose,
			false
		);

		if ('' !== this.props.focusOnOpen) {
			this.onOpen = () => {
				document.querySelectorAll(this.props.focusOnOpen)[0].focus();
			};
			this.refs.modal.addEventListener('shown.bs.modal', this.onOpen, false);
		}

		if (this.props.open) {
			this.modal.show();
		}
	}

	componentWillUnmount() {
		this.refs.modal.removeEventListener(
			'hidden.bs.modal',
			this.props.onClose,
			false
		);
		this.refs.modal.removeEventListener('shown.bs.modal', this.onOpen, false);
	}

	render() {
		const modalClasses = classNames({
			'modal-dialog': yes,
			'modal-lg': this.props.large,
			'modal-sm': this.props.small,
		});

		return (
			<div
				ref="modal"
				className={classNames(['modal', this.props.className])}
				tabIndex="-1"
				role="dialog"
			>
				<div className={modalClasses} role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{this.props.title}</h5>
							{this.props.closable && (
								<button
									type="button"
									className="close"
									aria-label="Close"
									data-dismiss="modal"
								>
									<span aria-hidden="true">&times;</span>
								</button>
							)}
						</div>
						<div className="modal-body">{this.props.children}</div>
						<div className="modal-footer">{this.props.footer}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
