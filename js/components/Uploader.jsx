// Requires.
import React from 'react';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { yes, no, on, off } from '../utils/bools';

class Uploader extends React.Component {
	static defaultProps = {
		onFilesAdded() {},
		onFileUploaded() {},
		onUploadProgress() {},
		dragHappening: no,
	};

	static propTypes = {
		onFilesAdded: PropTypes.func,
		onFileUploaded: PropTypes.func,
		onUploadProgress: PropTypes.func,
		dragHappening: PropTypes.bool,
	};

	state = {
		dragOver: no,
	};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	componentDidMount() {
		var pconfig = false;
		var uploaderEl = document.getElementById('plupload-upload-ui');
		var dragDropEl = document.getElementById('drag-drop-area');

		pconfig = Object.assign({}, base_plupload_config);
		pconfig.multipart_params._ajax_nonce = this.props.nonce;
		pconfig['file_data_name'] = 'file';
		pconfig.multi_selection = on;

		const uploader = new plupload.Uploader(pconfig);

		// A file was added in the queue (we start uploading immediately).
		uploader.bind('FilesAdded', (up, files) => {
			this.props.onFilesAdded(up, files);
			up.refresh();
			up.start();
		});

		// An uploading file makes progress.
		uploader.bind('UploadProgress', this.props.onUploadProgress);

		// A file finished uploading.
		uploader.bind('FileUploaded', this.props.onFileUploaded);

		uploader.init();
	}

	handleDragEnter(event) {
		if (!this.state.dragOver) {
			this.setState({ dragOver: yes });
		}
	}

	handleDragLeave(event) {
		if (this.state.dragOver) {
			this.setState({ dragOver: no });
		}
	}

	handleMouseOver(event) {
		if (!this.state.mouseOver) {
			this.setState({
				mouseOver: yes,
				dragOver: no,
			});
		}
	}

	handleMouseLeave(event) {
		if (this.state.mouseOver) {
			this.setState({
				mouseOver: no,
				dragOver: no,
			});
		}
	}

	render() {
		return (
			<form name="upload" method="POST" encType="multipart/form-data">
				<div
					className={
						'uploader plupload-upload-ui' +
						(this.state.dragOver ? ' drag-over' : '') +
						(this.state.mouseOver ? ' mouse-over' : '')
					}
					id="plupload-upload-ui"
				>
					<div
						id="drag-drop-area"
						className="drag-drop-area"
						onDragOver={this.handleDragEnter}
						onDragEnter={this.handleDragEnter}
						onDragLeave={this.handleDragLeave}
						onDrop={this.handleDragLeave}
						onMouseOver={this.handleMouseOver}
						onMouseLeave={this.handleMouseLeave}
					>
						<div className="drag-drop-inside">
							<p key="drag" className="drag-drop-info drop-files-note">
								{this.props.text.drag}
							</p>
							<p key="or" className="drop-files-or">
								{this.props.text.or}
							</p>
							<p key="button" className="drag-drop-buttons">
								<input
									id="plupload-browse-button"
									type="button"
									value={this.props.text.selectFiles}
								/>
							</p>
							{this.state.dragOver && (
								<p key="drop" className="drag-drop-letgo">
									<FontAwesomeIcon icon="arrow-alt-circle-down" size="4x" />
								</p>
							)}
						</div>
					</div>
					<div className="filelist" />
				</div>
				<div
					className="plupload-thumbs plupload-thumbs-multiple"
					id="plupload-thumbs"
				/>
				<div className="clear" />
			</form>
		);
	}
}

export default Uploader;
