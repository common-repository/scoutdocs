import { connect } from 'react-redux';
import DocTableRow from '../components/DocTableRow';
import * as selectors from '../selectors';
import * as doc from '../modules/doc';
import * as docs from '../modules/docs';

const mapStateToProps = (state, ownProps) => {
	const currentDoc =
		selectors.getDoc(state, ownProps.docId) || doc.initialState;
	const readers = currentDoc.readers.filter(r => r !== state.user.id);

	return {
		baseUrl: selectors.getLocalUrl(state),
		basePath: selectors.getBasePath(state),
		canModify: state.subscription.license !== 'invalid',
		canView: state.subscription.license !== 'invalid',
		totalReaders: selectors.getTotalDocReaders(state, ownProps.docId),
		doc: currentDoc,
		readers,
		isCurrentUserDoc: currentDoc.author === state.user.id,
	};
};

const mapDispatchToProps = dispatch => ({
	onUpdateTitle: (id, title) => {
		dispatch(doc.server.updateTitle(id, title));
	},
	onViewDoc: id => {
		dispatch(doc.server.view(id));
	},
	onDeleteDoc: id => {
		dispatch(docs.server.remove(id));
	},
	onUpdateAcceptance: (id, value) => {
		dispatch(doc.server.updateAcceptance(id, value));
	},
	onUpdateReaders: (d, readers) => {
		dispatch(doc.server.setReaders(d, readers));
	},
	onUpdateGroups(d, groups) {
		dispatch(doc.server.setGroups(d, groups));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(DocTableRow);
