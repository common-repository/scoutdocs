import Uploader from '../components/Uploader';
import * as docs from '../modules/docs';
import * as doc from '../modules/doc';
import { connect } from 'react-redux';
import delay from 'lodash/fp/delay';

const mapStateToProps = state => ({
	text: state.text.uploader,
});

// Todo: remove the uploader param.
const mapDispatchToProps = dispatch => ({
	onFilesAdded: (uploader, files) => {
		dispatch(docs.server.addFiles(files));
	},
	onFileUploaded: (uploader, file, result) => {
		const newDoc = JSON.parse(result.response).data;

		// Clean up the data we got.
		newDoc.readers = newDoc.readers.map(r => r.id);
		newDoc.groups = newDoc.groups.map(g => g.id);
		newDoc.author = newDoc.author.id;

		dispatch(doc.setUploadPercent(file.id, 100));
		dispatch(doc.update(file.id, { ...newDoc, key: file.id }));

		// Todo: Move this to a Saga.
		delay(2000)(() => {
			dispatch(doc.completeUpload(newDoc.id));
		});
	},
	onUploadProgress: (uploader, file) => {
		dispatch(doc.setUploadPercent(file.id, file.percent));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
