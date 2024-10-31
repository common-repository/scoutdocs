import { call, put } from 'redux-saga/effects';
import * as groups from '../modules/groups';
import { remoteAjax } from './ajax';

export default function* createUser(action) {
	try {
		const response = yield call(remoteAjax, {
			path: 'groups',
			data: {
				title: action.title,
			},
		});

		if (response.data.success) {
			yield put(groups.add(response.data.data));
			return response.data.data;
		}
	} catch (error) {}
}
