


export function updateHandle (handle){
	return { type: 'UPDATE-HANDLE', payload: handle}
} 

export function ghostFlag (flag){
	return {type: 'FLIP-GHOST', payload: flag}
}

export function dropDowned (flagTurn, updated_arrow_state){
	return { 
		type: "DROPDOWN",
		[flagTurn] : updated_arrow_state
	}
}

//Will now be called from componentWillMount
export function fetchData (typeVar, snapshot){

    //firebase.getSnapshot().
    
    
	var returnVal = {
		type: typeVar,
		payload: snapshot,
		status: 'RECEIVED'
	}
	return returnVal;
}

/*
export function fetchData (typeVar, snapshot){
	if(!snapshot){
		return {type: typeVar, status : 'LOADING'}
	}
	var returnVal = {
		type: typeVar,
		payload: snapshot,
		status: 'RECEIVED'
	}
	return returnVal;
}
*/

export function addAttribute (eventValue){
	return {type: eventValue}
}


<<<<<<< HEAD
export function setSelectedItem (element_selected){
	return {type: 'VISUAL-SELECTION', payload: element_selected}
}

/*
  
 */

//Called from App 
=======
export function setSelectedItem (flag, element_selected){
	return {type: 'VISUAL-SELECTION', flag: flag, payload: element_selected}
}
>>>>>>> 23535e50704cf9d316395eb316243052c72a8925
