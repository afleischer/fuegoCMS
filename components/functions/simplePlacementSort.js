/*
function placementSort(someArray){
	//get the first index
	let resultArray = [];
	for (i = 0; i <= someArray.length; i++){
		let firstValue = someArray[i];
		let nextValue = someArray[i+1];

		if(Number.isInteger(firstValue) && Number.isInteger(nextValue)){
			if(firstValue == nextValue){
				throw "Values should not be equal as returned from the database.  Somewhere\
				the code is inputting equal values which don't work for indexing";
			}
			resultArray.push(max(firstIndex, nextIndex)); 
		}
		else if(Number.isInteger(firstValue) && !Number.isInteger(nextValue)){
			//sort alphanumerically.
			let tempArray = [];
			let firstValueString = firstValue.toString();
			tempArray.push(max(firstValueString, nextValue));
			tempArray.push(min(firstValueString, nextValue));

			tempArray.sort();
			for(item in tempArray){
				resultArray.push(item);
			}
		} 
		else if(!Number.isInteger(firstValue) && Number.isInteger(nextValue)){
			//sort alphanumerically.
			let tempArray = [];
			let nextValueString = nextValue.toString();
			tempArray.push(max(firstValue, nextValueString));
			tempArray.push(min(firstValue, nextValueString));

			tempArray.sort();
			for(item in tempArray){
				resultArray.push(item);
			}
		}
		else if(!Number.isInteger(firstValue) && !Number.isInteger(nextValue)){
			
		}
	
	for()
}
*/

let placementArray = [];

const simplePlacementSort = (someArray) =>{
	for (let i = 0; i < someArray.length; i++){
		if ((someArray[i+1] < someArray[i]) && (typeof(someArray[i]) == "number" && typeof(someArray[i+1]) == "number")){
			let pre = placementArray.slice(0, someArray[i]);
			let mod = placementArray.slice(someArray[i], someArray[i+1]);
			let prior = placementArray.slice(someArray[i+1], someArray[i+2]);
			let post = placementArray.slice(someArray[i+2]);
			placementArray = pre + mod + prior + post;
		}
	}
return placementArray;
}

export default simplePlacementSort;