import { all, put } from 'redux-saga/effects';
import * as docs from '../modules/docs';
import * as uploader from '../modules/uploader';

export default function* addFiles(action) {
	yield put(uploader.close());

	const date = Math.floor(Date.now() / 1000);

	yield all(
		action.files.map(file => {
			return put(
				docs.add({
					id: file.id,
					key: file.id,
					uploading: true,
					percent: 0,
					prevPercent: 0,
					title: file.name,
					created: date,
					modified: date,
				})
			);
		})
	);
}
