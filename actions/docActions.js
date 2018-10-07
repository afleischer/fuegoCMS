

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

export function addAttribute (eventValue){
	return {type: eventValue}
}


export function setSelectedItem (flag, element_selected){
	return {type: 'VISUAL-SELECTION', flag: flag, payload: element_selected}
}