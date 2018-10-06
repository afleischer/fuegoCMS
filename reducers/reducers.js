import { combineReducers } from 'redux';
import undoable, { distinctState } from 'redux-undo';
import { firebaseStateReducer  } from 'react-redux-firebase';

export const rootReducer = ( state = 0, action) => {


	if(typeof(state) === "undefined"){
		state = 0;
	}

	switch (action.type){


		case 'SELECTED':
			return Object.assign({}, state, {

			})

		case 'DROPDOWN':
			return Object.assign({}, state, {
				
			})
		case 'PAGESNAP':
			if(action.status == 'LOADING'){
				return Object.assign({}, state, {
					PageSnapshot : null
				})
			}
			if(action.payload){
				return Object.assign({}, state, {
					PagesSnapshot : action.payload	
				})				
			}else { return state}

		case 'BLOGSNAP':
			if(action.status == 'LOADING'){
				return Object.assign({}, state, {
					BlogSnapshot : null
				})
			}

			if(action.payload){
				return Object.assign({}, state, {
					BlogSnapshot : action.payload	
				})				
			}else { return state}
		case 'IMAGESNAP':
			if(action.status == 'LOADING'){
				return Object.assign({}, state, {
					ImageSnapshot : null
				})
			}

			if(action.payload){

				return Object.assign({}, state, {
					ImageSnapshot : action.payload	
				})				
			}else { return state}

		case 'CURRENTEDITPAGE':

			return Object.assign( {}, state, {
				CurrentEditPageHandle : action.payload
			})

		default:
			return state
	}


}

