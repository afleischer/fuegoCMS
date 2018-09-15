
// the below will be called from tagSnapshot.forEach(){}

let placementArray = []

//forEach in tagSnapshot, push the tag values 

let JSXArray = []

let setter;

function GetHTMLFromTagSnapshot(tagSnapshot){
	let tag_name = tagSnapshot.tag_type;
	let tag_placement = tagSnapshot.placement;
	let tag_content = tagSnapshot.content;
	let tag_attributes = tagSnapshot.attributes;

	//A "true" returned indicates that the setter is 
	//ahead of the current tag array.  Do NOT render
	//The following code in this case!
	let setterFlag = fetchSetter(tag_placement);

	if(setterFlag == false || setter == 0){
		let theVar = React.createElement(
		tag_name,
		tag_attributes,
		checkVoid(tag_name) ? null : checkChildren(tag_placement);
		);

		JSXArray.push(theVar);
	}

}

function fetchSetter(tag_placement){
	//Part 1: Set a setter if none has been set. 
	if(!setter){
		setter = 0;
	}
	for(iterator in placementArray){
		if (placementArray[iterator] === tag_placement){
			//Our setter is equal to our current placement.  
			//We're free to create a react child. 
			if(setter > iterator){
				return true;
			}
			setter = iterator;
		}
	}
}

function checkChildren(tag_placement){
	//hard problem: I can't suddenly get the value for the forEach.  

	//Part 0: If the setter is on our location or ahead of us, do NOT
	//render a react child and instead return null. 
		//This part will probably be hoisted up. 


	//Part 1: Find where we are in the placement array (find the 'setter')
		let ourTag = tag_placement;
		let setter;

		for (iter in placementArray){
			if (ourTag == placementArray[iter]){
				setter = iter; 
			}
		}

	//setter will be returned so that 
}