import GroupManager from '../components/GroupManager';
import { connect } from 'react-redux';
import * as group from '../modules/group';
import * as groups from '../modules/groups';
import * as groupManager from '../modules/groupManager';

const mapStateToProps = state => ({
	open: state.groupManager.open,
	groups: state.groups,
	canCreate: state.user.canCreateUsers,
});

const mapDispatchToProps = dispatch => ({
	onCreate: title => {
		dispatch(groups.server.create(title));
	},
	onUpdateTitle: (id, title) => {
		dispatch(group.server.updateTitle(id, title));
	},
	onDelete: id => {
		dispatch(groups.server.remove(id));
	},
	onClose: () => {
		dispatch(groupManager.close());
	},
	onUpdateReaders: (groupId, readerIds) => {
		dispatch(group.server.setUsers(groupId, readerIds));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupManager);
