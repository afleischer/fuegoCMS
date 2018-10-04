

export function updateHandle (handle){
	return { type: 'UPDATE-HANDLE', handle}
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
	var returnVal = {
		type: typeVar,
		payload: snapshot
	}
	return returnVal;
}

export function addAttribute (eventValue){
	return {type: eventValue}
}


export function setSelectedItem (element_selected){
	return {type: 'VISUAL-SELECTION', payload: element_selected}
}