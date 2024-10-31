import { call, put } from 'redux-saga/effects';
import * as users from '../modules/users';
import { localAjax } from './ajax';

export default function* createUser(action) {
	try {
		const response = yield call(localAjax, {
			action: 'create-user',
			userName: action.name,
			userEmail: action.email,
		});

		if (response.data.success) {
			yield put(users.add(response.data.data));
			return response.data.data;
		}
	} catch (error) {}
}
