import ajax from 'axios';
import omit from 'lodash/fp/omit';
import { stringify } from 'qs';

export const local = (ajaxUrl, nonce) => {
	return (config = { data: {} }) => {
		// Inject the `_sd_nonce` into data.
		config.data = config.data || {};
		config.data = { ...config.data, _sd_nonce: nonce };

		return ajax({
			url: ajaxUrl,
			...config,
			data: stringify(config.data),
			method: 'post', // Always POST.
		});
	};
};

export const remote = (apiUrl, userKey) => {
	return (config = { data: {} }) => {
		// Inject the `user_key` into data.
		config.data = config.data || {};
		config.data = { ...config.data, user_key: userKey };

		// Method defaults to 'post'.
		const method = config.method || 'post';
		const headers = {
			...config.headers,
			'X-HTTP-Method-Override': method.toUpperCase(),
		};

		return ajax(
			omit('path')({
				url: apiUrl + config.path,
				...config,
				headers,
				method: 'post', // Always POST.
			})
		);
	};
};

export default remote;
