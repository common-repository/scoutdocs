import { combineReducers } from 'redux';

import users from './users';
import groups from './groups';
import docs from './docs';
import user from './currentUser';
import animateDocRows from './animateDocRows';
import uploader from './uploader';
import docsPage from './docsPage';
import groupManager from './groupManager';

// Generics.
import number from './number';
import object from './object';
import string from './string';

export default combineReducers({
	user,
	users,
	groups,
	docs,
	animateDocRows,
	uploader,
	docsPage,
	groupManager,
	docReaderStatuses: object,
	urls: object,
	version: string,
	perPage: number,
	logo: string,
	sdLogoUrl: string,
	text: object,
	subscription: object,
});
