import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './modules/index';
import rootSaga from './sagas/index';
import * as doc from './modules/doc';

const sagaMiddleware = createSagaMiddleware();

const ScoutDocs = {
	init: function(el, initialData) {
		if (el) {
			this.initialData = initialData;

			const composeEnhancers =
				window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

			const store = createStore(
				reducers,
				initialData,
				composeEnhancers(applyMiddleware(sagaMiddleware))
			);
			sagaMiddleware.run(rootSaga);
			this.store = store;
			const app = (
				<Provider store={store}>
					<Router>
						<App />
					</Router>
				</Provider>
			);
			render(app, el);
		}
	},
	viewDoc: function(id) {
		this.store.dispatch(doc.server.view(id));
	},
};

export default ScoutDocs;
