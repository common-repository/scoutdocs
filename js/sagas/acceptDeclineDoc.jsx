import { call, select, put } from 'redux-saga/effects';
import * as doc from '../modules/doc';
import * as selectors from '../selectors';
import remoteAjax from './ajax';

export default function* acceptRejectDoc(action) {
	try {
		// Accepting or rejecting?
		const newStatus =
			action.type === doc.server.ACCEPT ? 'accepted' : 'declined';

		// Grab the old value.
		const old = yield select(selectors.getDocStatus, action.id);

		// Set up the actions.
		const updateLocal = put(doc.setStatus(action.id, newStatus));
		const undoLocal = put(doc.setStatus(action.id, old));
		const updateRemote = call(remoteAjax, {
			path: `document/${action.id}/status/${newStatus}`,
		});

		// Hopefully update the doc.
		yield updateLocal;

		try {
			// Try updating the server.
			yield updateRemote;
		} catch (error) {
			// Undo on failure.
			yield undoLocal;
		}
	} catch (e) {
		console.error(e);
	}
}

/*
	acceptRejectDoc(doc, accept = yes) {
		const status = accept ? 'accepted' : 'declined';

		// Make the request.
		this.remoteAjax({
			path: `document/${doc.id}/status/${status}`,
		})
			.then(response => {
				if (response.data.success) {
					this.setState(prevState => {
						const docs = [...prevState.docs];
						const targetDoc = docs.find(d => d.id === doc.id);
						targetDoc.status = status;

						return { docs };
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	}
 */
