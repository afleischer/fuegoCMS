import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import App from './app'

import { Provider } from 'react-redux';
import {applyMiddleware, createStore, combineReducers } from 'redux';
import {rootReducer} from './reducers/reducers';
import { store } from './store/index';
import { fetchData, ghostFlag, dropDowned, addAttribute, setSelectedItem } from './actions/docActions';


//const store = createStore(rootReducer);

/*
export const store = createStore(
  state: rootReducer,
  
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
*/


ReactDOM.render(
 <Provider store = {store}>
    <App />
 </Provider>,

 document.getElementById('root')
); 


