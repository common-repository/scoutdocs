// React.
import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

// Utils.
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import { yes, no, on, off } from '../utils/bools';
import { docIsViewed } from '../utils/doc';

// UI.
import scrollToTop from '../utils/scroll-to-top';
import fontawesome from '@fortawesome/fontawesome';
import icons from '../utils/fontawesome';
fontawesome.library.add(...icons);

// Modules.
import * as uploader from '../modules/uploader';

// Components.
import DocTable from '../containers/DocTable';
import Page from '../containers/Page';
import DocPage from '../containers/DocPage';
import Profile from '../containers/Profile';

class App extends React.Component {
	static defaultProps = {};

	static propTypes = {};

	constructor() {
		super(...arguments);
		autobind(this);
	}

	componentDidMount() {
		document.body.addEventListener('dragleave', this.handleDragLeave);
	}

	handleDragLeave(event) {
		var x = event.clientX;
		var y = event.clientY;
		if (!x && !y) {
			if (this.props.uploader.open && this.props.uploader.byDrag) {
				this.props.dispatch(uploader.close());
			}
		}
	}

	renderDocTableNew() {
		return this.renderDocTable(doc => !docIsViewed(doc));
	}

	renderDocTableAll() {
		return this.renderDocTable();
	}

	renderDocTable(filter) {
		return (
			<Page fullWidth={yes} containerClasses={['no-phone-title']}>
				<div className="row scoutdocs-main">
					<div className="col-12 logo-title">{this.renderLogo()}</div>

					<div className="col-12">
						<DocTable filter={filter} />
					</div>
				</div>
			</Page>
		);
	}

	renderLogo() {
		if (!this.props.hasDocs) {
		} else if (!this.props.logo.length) {
			return <h1>{this.props.text.documents}</h1>;
		} else {
			return <img className="logo" src={this.props.logo} />;
		}
	}

	renderDoc({ match }) {
		const docId = parseInt(match.params.doc, 10);

		return <DocPage docId={docId} />;
	}

	renderProfile() {
		return (
			<Page>
				<Profile />
			</Page>
		);
	}

	render() {
		const path = this.props.urls.scoutdocsPath;

		return (
			<Switch>
				<Route path={`${path}/profile`} render={this.renderProfile} />
				<Route path={`${path}/:doc(\\d+)`} render={this.renderDoc} />
				<Route path={`${path}/new`} render={this.renderDocTableNew} />
				<Route path={path} render={this.renderDocTableAll} />
			</Switch>
		);
	}
}

export default App;
