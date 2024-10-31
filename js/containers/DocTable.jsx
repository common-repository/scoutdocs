import { connect } from 'react-redux';
import DocTable from '../components/DocTable';
import * as docsPage from '../modules/docsPage';
import * as doc from '../modules/doc';
import * as docs from '../modules/docs';

// Utils.
import flow from 'lodash/fp/flow';
import reverse from 'lodash/fp/reverse';
import sortBy from 'lodash/fp/sortBy';
import pick from 'lodash/fp/pick';

const modifiedSort = sortBy('modified');

const mapStateToProps = (state, ownProps) => {
	let docs = flow(modifiedSort, reverse)(state.docs);

	if (ownProps.filter) {
		docs = docs.filter(ownProps.filter);
	}

	const totalDocs = docs.length;

	if (totalDocs > state.perPage) {
		const index = state.perPage * (state.docsPage - 1);
		docs = docs.slice(index, state.perPage + index);
	}

	docs = docs.map(doc => pick(['id', 'key'])(doc));

	return {
		baseUrl: state.urls.scoutdocs,
		basePath: state.urls.scoutdocsPath,
		colTitles: state.text.colTitles,
		actionTitles: state.text.actionTitles,
		readerLimit: state.subscription.readerLimit,
		canUpload: state.subscription.license !== 'invalid',
		animate: state.animateDocRows,
		perPage: state.perPage,
		page: state.docsPage,
		docs,
	};
};

const mapDispatchToProps = dispatch => ({
	onNavigateToPage: page => {
		dispatch(docsPage.goToPage(page));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(DocTable);
