import Component from '../components/App.jsx';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
	hasDocs: state.docs.length > 0,
	uploader: state.uploader,
	urls: state.urls,
	version: state.version,
	logo: state.logo,
	sdLogoUrl: state.sdLogoUrl,
	text: state.text,
});

export default withRouter(connect(mapStateToProps)(Component));
