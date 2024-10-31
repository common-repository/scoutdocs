import TopNav from '../components/TopNav';
import * as uploader from '../modules/uploader';
import * as groupManager from '../modules/groupManager';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
	user: state.user,
	text: state.text,
	urls: state.urls,
	newDocs: state.docs.filter(d => d.status === 'unread').length,
	uploaderOpen: state.uploader.open,
	version: state.version,
	sdLogoUrl: state.sdLogoUrl,
	canUpload: state.subscription.license !== 'invalid',
});

const mapDispatchToProps = dispatch => ({
	onAddClick: () => dispatch(uploader.toggle()),
	onGroupManageClick: () => dispatch(groupManager.toggle()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
