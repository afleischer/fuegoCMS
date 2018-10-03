

export function updateHandle (handle){
	return { type: 'UPDATE-HANDLE', handle}
} 

export function ghostFlag (flag){
	return {type: 'FLIP-GHOST', !flag}
}

export function dropDowned (flagTurn, updated_arrow_state){
	return { [flagTurn], updated_arrow_state}
}


export function fetchData (ref){
	return {type: ref}
}
