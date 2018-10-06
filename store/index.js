import React from 'react';
import {applyMiddleware, createStore, combineReducers, compose } from 'redux';
import {rootReducer} from '../reducers/reducers';
import { reduxFirebase, reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import firebase from '../firebase'


export const store = createStore(
	combineReducers({
		state: rootReducer
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


