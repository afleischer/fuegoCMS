


const reducers = ( state , action) => {
	switch (action.type){
		case 'EXAMPLE':
			return {
				...state,
				exampleProp : "newProp"
			}
		case 'EXAMPLE-TWO':
			return {
				...state,
				exampleProp_2 : "newProp_2"
			}
	}


}