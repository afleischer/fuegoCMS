import undoable, { distinctState } from 'redux-undo';


export const rootReducer = ( state = initialState , action) => {
	switch (action.type){
		case 'SELECTED':
			return Object.assign({}, state, {

			})

		case 'DROPDOWN':
			return Object.assign({}, state, {
				
			})
		case 'PAGESNAP':
			return Object.assign({}, state, {
				PagesSnapshot : action.payload	
			})
		case 'BLOGSNAP':
			return Object.assign({}, state, {
				BlogsSnapshot : action.payload
			})
		case 'IMAGESNAP':
			return Object.assign({}, state, {
				ImageSnapshot : action.payload
			})

		default:
			return state
	}


}

