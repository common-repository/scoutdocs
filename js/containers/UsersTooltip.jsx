import { connect } from 'react-redux';
import UsersTooltip from '../components/UsersTooltip';
import * as selectors from '../selectors';

const notUndefined = i => i !== undefined;

const mapStateToProps = (state, ownProps) => ({
	users:
		ownProps.users ||
		ownProps.userIds
			.map(uid => selectors.getUser(state, uid))
			.filter(notUndefined),
});

export default connect(mapStateToProps)(UsersTooltip);
