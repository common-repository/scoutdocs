import ReaderChooser from '../components/ReaderChooser';
import { connect } from 'react-redux';
import * as users from '../modules/users';
import * as doc from '../modules/doc';
import * as selectors from '../selectors';

const notUndefined = i => i !== undefined;

const populateUsersInGroups = (state, groups) => {
	return groups.map(g => {
		const userObjects = g.users
			.map(uid => selectors.getUser(state, uid))
			.filter(notUndefined);
		return { ...g, users: userObjects };
	});
};

const mapStateToProps = (state, ownProps) => {
	const doc = ownProps.docId ? selectors.getDoc(state, ownProps.docId) : null;

	return {
		readerLimit: state.subscription.readerLimit,
		showAcceptance: ownProps.showAcceptance,
		user: state.user,
		users: ownProps.omitCurrentUser
			? state.users.filter(u => u.id !== state.user.id)
			: state.users,
		groups: populateUsersInGroups(state, state.groups),
		canCreate: state.user.canCreateUsers,
		withStatus: !!ownProps.docId,
		readers: ownProps.readers.map(rid => {
			const reader = selectors.getUser(state, rid);

			if (doc) {
				return {
					...reader,
					status: selectors.getUserDocStatus(state, doc.id, rid),
				};
			}

			return reader;
		}),
		readerGroups: populateUsersInGroups(
			state,
			ownProps.readerGroups.map(gid => selectors.getGroup(state, gid))
		),
	};
};

const mapDispatchToProps = dispatch => ({
	onCreate: (name, email) => {
		dispatch(users.server.create(name, email));
	},
});

const component = connect(mapStateToProps, mapDispatchToProps)(ReaderChooser);

component.defaultProps = {
	readers: [],
	readerGroups: [],
};

export default component;
