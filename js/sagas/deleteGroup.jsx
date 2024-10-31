import { call, put } from 'redux-saga/effects';
import * as groups from '../modules/groups';
import { remoteAjax } from './ajax';

export default function* deleteGroup(action) {
	try {
		const response = yield call(remoteAjax, {
			path: 'group/' + action.id,
			method: 'delete',
		});

		if (response.data.success) {
			yield put(groups.remove(action.id));
			return response.data.data;
		}
	} catch (error) {}
}
