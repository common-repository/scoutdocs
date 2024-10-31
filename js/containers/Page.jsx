import { connect } from 'react-redux';
import Page from '../components/Page';

const mapStateToProps = state => ({
	canManageGroups: state.user.canCreateUsers,
	uploaderOpen: state.uploader.open,
});

export default connect(mapStateToProps)(Page);
