import { call, select } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as ajax from '../utils/ajax';

export function* localAjax(data) {
	const localUrl = yield select(selectors.getLocalUrl);
	const nonce = yield select(selectors.getUserNonce);

	const local = data => {
		return ajax
			.local(localUrl, nonce)({ data })
			.catch(e => {
				throw e;
			});
	};

	return yield call(local, data);
}

export function* remoteAjax(config) {
	const apiUrl = yield select(selectors.getApiUrl);
	const userKey = yield select(selectors.getUserKey);

	const remote = config => {
		return ajax
			.remote(apiUrl, userKey)(config)
			.catch(e => {
				throw e;
			});
	};

	return yield call(remote, config);
}

export default remoteAjax;
