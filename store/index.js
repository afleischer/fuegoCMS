import React from 'react';
import { createStore, combineReducers } from 'redux';
import {rootReducer} from '../reducers/reducers';

export const store = createStore(
	combineReducers({
		state: rootReducer
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);