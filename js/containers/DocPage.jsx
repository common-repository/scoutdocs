import { connect } from 'react-redux';
import * as selectors from '../selectors';
import * as doc from '../modules/doc';
import DocPage from '../components/DocPage';

const mapStateToProps = (state, ownProps) => {
	return {
		doc: selectors.getDoc(state, ownProps.docId),
		urls: state.urls,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	onAccept: () => {
		dispatch(doc.server.accept(ownProps.docId));
	},
	onDecline: () => {
		dispatch(doc.server.reject(ownProps.docId));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(DocPage);
