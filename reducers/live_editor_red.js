import undoable, { distinctState } from 'redux-undo';



const editorStatus = ( state , action) => {
	switch (action.type){
		case 'selected':
			return {
				...state,
				exampleProp : "newProp"
			}

	}


}

const undoableEditor = undoable(editorStatus, {
	filter: distinctState()  
})

export default undoableTodos;