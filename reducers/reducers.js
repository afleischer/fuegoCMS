import undoable, { distinctState } from 'redux-undo';


export const rootReducer = ( state , action) => {

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
			if(action.payload){
				return Object.assign({}, state, {
					PagesSnapshot : action.payload	
				})				
			}else { return state}

		case 'BLOGSNAP':
			if(action.payload){
				return Object.assign({}, state, {
					BlogSnapshot : action.payload	
				})				
			}else { return state}
		case 'IMAGESNAP':
			if(action.payload){
				return Object.assign({}, state, {
					ImageSnapshot : action.payload	
				})				
			}else { return state}

		default:
			return state
	}


}

