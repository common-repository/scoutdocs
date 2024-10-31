import { call, put } from 'redux-saga/effects';
import * as user from '../modules/user';
import { localAjax } from './ajax';

export default function* updateCurrentUser(action) {
	try {
		const response = yield call(localAjax, {
			action: 'profile',
			userName: action.name,
			userEmail: action.email,
		});

		if (response.data.success) {
			const data = response.data.data;
			yield put(user.updateName(data.id, data.name));
			yield put(user.updateEmail(data.id, data.email));
			return response.data.data;
		}
	} catch (error) {}
}
