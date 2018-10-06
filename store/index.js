import React from 'react';
import {applyMiddleware, createStore, combineReducers, compose } from 'redux';
import {rootReducer} from '../reducers/reducers';
import { reduxFirebase, reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import firebase from '../firebase'


const config = {
    apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
    authDomain: "fuegocms.firebaseapp.com",
    databaseURL: "https://fuegocms.firebaseio.com",
    projectId: "fuegocms",
    storageBucket: "fuegocms.appspot.com",
    messagingSenderId: "283527892810"
};
firebase.initializeApp(config);


export default function configureStore (initialState, history) {
    const createStoreWithMiddleware = compose (
	reduxFirebase(config, {userProfile: 'users'}),
	typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f)(createStore)
    const store = createStoreWithMiddleware(rootReducer)

    if(module.hot) {
	//Enable Webpack hot module replacement for reducers
	module.hot.accept('./reducer', () => {
	    const nextRootReducer = require ('./reducer')

	    store.replaceReducer(nextRootReducer)
	})
    }

    return store
}


export const store = createStore(
	combineReducers({
		state: rootReducer
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


