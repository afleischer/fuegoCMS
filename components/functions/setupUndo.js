import React, { Component } from 'react';

import { store } from './store/index';
import { connect } from 'react-redux';
import { UNDO_CALL, REDO_CALL } from '../../actions/docActions';

/*==========
Action creators for App-level Undo and Redo actions
==========*/

export const undoAction = () => {



	var platform = window.navigator.oscpu;

	document.addEventListener("keydown", (event) => {

			//if the user presses command+z
		var keymap = { 90: false }
			if (event.keycode in keymap){
				keymap[event.keycode] = true;
			}

		if(platform.includes("Mac")){

			if (keymap[90] && event.metaKey === true){
			//dispatch an undo action
				dispatch(UNDO_CALL);
			}
		}

		else {
			//
			if ( keymap[90] && event.ctrlKey === true){
				dispatch(UNDO_CALL);			
			}
		}
	});

}



export const redoAction = () => {


	var platform = window.navigator.oscpu;

	document.addEventListener("keydown", (event) => {

			//if the user presses command+z
		var keymap = {89: false}
			if (event.keycode in keymap){
				keymap[event.keycode] = true;
			}

		if(platform.includes("Mac")){

			if (keymap[89] && event.metaKey === true){
			//dispatch an undo action
				dispatch(REDO_CALL);
			}
		}

		else {
			//
			if (keymap[89] && event.ctrlKey === true){
				dispatch(REDO_CALL);			
			}
		}
	});

}

