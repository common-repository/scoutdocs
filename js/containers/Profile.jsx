import Profile from '../components/Profile';
import * as currentUser from '../modules/currentUser';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
	user: state.user,
});

const mapDispatchToProps = dispatch => ({
	onUpdateUser: user =>
		dispatch(currentUser.server.update(user.id, user.name, user.email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
