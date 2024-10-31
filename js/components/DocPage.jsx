import React, { Fragment } from 'react';
import Page from '../containers/Page';
import Doc from '../components/Doc';
import { yes, no, on, off } from '../utils/bools';

export default ({ doc, urls, onAccept, onDecline }) => {
	let page = (
		<Fragment>
			<h1>404</h1>
			<p>The requested item could not be found.</p>
		</Fragment>
	);
	let navCenter = null;

	if (undefined !== doc) {
		page = <Doc doc={doc} urls={urls} />;

		const navItem =
			doc.acceptance &&
			doc.status !== 'accepted' &&
			doc.status !== 'declined' ? (
				<Fragment>
					<button
						key="accept"
						type="button"
						className="btn btn-success"
						onClick={e => {
							e.preventDefault();
							onAccept();
						}}
					>
						Accept
					</button>
					<button
						key="decline"
						type="button"
						className="btn btn-danger"
						onClick={e => {
							e.preventDefault();
							onDecline();
						}}
					>
						Decline
					</button>
				</Fragment>
			) : (
				<h2 className="align-self-center">{doc.title}</h2>
			);

		navCenter = <li className="nav-item center-item">{navItem}</li>;
	}

	return (
		<Page fullWidth={yes} navCenter={navCenter}>
			{page}
		</Page>
	);
};
