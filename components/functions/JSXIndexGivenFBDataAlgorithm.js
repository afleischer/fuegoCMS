
import firebase, {sortedPagesSnapshot} from '../../firebase';

import React from 'react';

import naturalCompare from './natural_sort';
// the below will be called from tagSnapshot.forEach(){}

/*============
Assemble a list of placement variables that represent the 
placement list.  We will use these to index the HTML tags that we 
pull from the database. 
=============*/

/*================
PlacementSort


=================*/


const simplePlacementSort = (someArray) =>{
let pArray = [];
	for (let i = 0; i < someArray.length; i++){
		if ((someArray[i+1] < someArray[i]) && (typeof(someArray[i]) == "number" && typeof(someArray[i+1]) == "number")){
			let pre = someArray.slice(0, someArray.indexOf(someArray[i]));
			let mod = someArray.slice(someArray.indexOf(someArray[i]), someArray.indexOf(someArray[i+1]));
			let prior = someArray.slice(someArray.indexOf(someArray[i+1]), someArray.indexOf(someArray[i+2]));
			let post = someArray.slice(someArray.indexOf(someArray[i+2]));
			pArray = pArray.concat(pre, prior, mod, post);	
		}
	}
return pArray;
}


export const IndexHTMLGivenDBData = (props) => {




	let pageURL = props.pageURL;
	let snapshot = props.PagesSnapshot;


	if(!snapshot || snapshot.val() == null || !pageURL) {
		return(<div>Loading HTML</div>)
	}

	let placementArray_raw = [];
	var keysList = Object.keys(snapshot.child(pageURL).child('tags').val());
	var keysListSetter= 0;
	var keysSnapshot = snapshot.child(pageURL).child('tags').val();
	let parentSnap = snapshot.child(pageURL).child('tags').val();

	let theParentTrap = [];



	snapshot = snapshot.child(pageURL).child('tags');

	//Get the placement array to compare stuff to 
	snapshot.forEach(function(childSnapshot){
		//childSnapshot.
		placementArray_raw.push(childSnapshot.val().placement)
	});

	//let placementArray = placementArray_raw.sort(naturalCompare);
	let placementArray = simplePlacementSort(placementArray_raw);
	//let placementArray = Array.prototype.alphanumSort(placementArray_raw);

	//forEach in tagSnapshot, push the tag values 

	//JSXArray will be the value we will be pushing return values to 
	let JSXArray = [];
	//setter is the index of the placement array that we'll use
	//to determine if a child has already been added JSXArray
	let setter;


	snapshot.forEach(function(childSnapshot){

		let keysSnapshottest = keysSnapshot;
		initializeSetter();
		GetHTMLFromTagSnapshot(childSnapshot, keysSnapshot);

		//This value will be returned as the render. 


	});

	function initializeSetter(){
		if(!setter){
			if(placementArray){
				setter = 0;
			}
			else if (!placementArray){
				throw "Error: placementArray not defined by start of setter function";
			}
		}
	}

	function GetHTMLFromTagSnapshot(tagSnapshot){
		/*=========
		Fetch Tag snapshot values from Firebase
		==========*/

		var TagName = tagSnapshot.val().tag_type;
		var tag_placement = tagSnapshot.val().placement;
		var tag_content = tagSnapshot.val().content;
		var TagAttributes = tagSnapshot.val().attributes;

		/*=========
		Get 
		==========*/

		//A "true" returned indicates that the setter is 
		//ahead of the current tag array.  Do NOT render
		//The following code in this case!
		
		if(placementArray[setter] > tag_placement){
			//do NOT render this; it's already been rendered!
			//(the setter is pushed forward when an element is rendered)
			return false;
		}
		else if (placementArray[setter] == tag_placement){
			//Let's render this and push the setter forward one spot
			//in the placementArray

			//I can swap the below back to JSX syntax, but I don't want to 
			//deal with Jest not understanding JSX so *shrug face* 
			//let JSXVar = (<TagName {...TagAttributes}>{checkChildren(tag_placement)}<TagName/>);

			setter++;


			let childTags = checkChildren(tag_placement, tagSnapshot);
			
			let JSXVar = React.createElement(TagName, TagAttributes, [tag_content,childTags] );


			JSXArray.push(JSXVar);
			

		} else if (placementArray[setter] < tag_placement){
			//this shouldn't happen if placementArray is organized and the 
			//algorithm is working. 
			throw "Error: the setter value is behind the placement value.  Check if Firebase is \
			correctly sorting placement and that we don't have garbage values";
		}

	function checkChildren(tag_placement, childSnapshot){

		let nextTagTest = tag_placement + 1;


		let branch_levelJSX = [];

		//Part 0: If the setter is on our location or ahead of us, do NOT
		//render a react child and instead return null. 
			//Already accounted for from GetHTMLFromTagSnapshot

		//Part 0.5: Initialize the array of children to be returned. 

			let childArray = [];

		//Part 1: Get the current and next entries in the placementArray
			//let currPlacement = placementArray[tag_placement];
			let currIndex = placementArray.indexOf(tag_placement);

			let currPlacement = placementArray[currIndex];
			let nextPlacement = placementArray[currIndex + 1];

		//Part 2: Parse these out by '.' separator
		//or if they're numbers convert them to a string for conversion
			let currPlacement_parsed = currPlacement.toString().split(".") ? currPlacement.toString().split(".") : currPlacement.toString();
			let nextPlacement_parsed = nextPlacement.toString().split(".") ? nextPlacement.toString().split(".") : nextPlacement.toString();

		//We should have two arrays such as: 
			//ex:   1.1.1 => [1,1,1]  and 1.1.2 => [1,1,2]

		//Part 3: Compare the values of the first bit of the index arrays
			let theLargerArray = (currPlacement_parsed.length > nextPlacement_parsed.length) ? currPlacement_parsed : nextPlacement_parsed;

			for(let i = 0; i < theLargerArray.length; i++){

				var nextTag = tag_placement + 1;
				
			      if(currPlacement_parsed[i] == nextPlacement_parsed[i]){
			        //This digit is the same.  Do nothing and iterate to the next 
			        //of the bit arrays
			      }else if(!currPlacement_parsed[i] && nextPlacement_parsed[i]){
			        // ex: [ ... ,1.2 ,1.2.1 , ...]
			        //The next index contains a next-level nested element (i.e. children).  Return this
			        //and recall the function to check the next child.
			        

			        let nextTagReceived = nextTag;

			        //Part 4: From our database, get the database data  associated with the place
			        //let AssociatedTagData = snapshot.child.().childequalTo(nextTagReceived);
			    	//let AssociatedTagData = parentSnap.child(keysSnapshot[keysListSetter]).val();

			    	let AssociatedTagData = parentSnap[Object.keys(parentSnap)[setter]];

			        setter++;

			        	let TagName = AssociatedTagData.tag_type;
						let tag_placement = AssociatedTagData.placement;
						let tag_content = AssociatedTagData.content;
						let tag_attributes = AssociatedTagData.attributes;

						let childTags = checkChildren(tag_placement);

						let JSXChild = React.createElement(TagName, TagAttributes, [tag_content, childTags]);

			        //branch_levelJSX.push(<TagName>{tag_content}{checkChildren(tag_placement)}</ TagName>);
			        branch_levelJSX.push(JSXChild);
			    } 

			    else if (currPlacement_parsed[i] < nextPlacement_parsed[i]){
			    	//We have a sibling.  Add this to the branch. 
			    	//Since this is an increment 
			    	//let AssociatedTagData = grandSnapshot.child(keysSnapshot[keysListSetter]).val();

			    	let AssociatedTagData = parentSnap[Object.keys(parentSnap)[setter]];

					keysListSetter++;

			    	//let AssociatedTagData = childSnapshot.equalTo(nextTag);
			    		let TagName = AssociatedTagData.tag_type;
						let tag_placement = AssociatedTagData.placement;
						let tag_content = AssociatedTagData.content;
						let tag_attributes = AssociatedTagData.attributes;

					//Push the setter forward.
					setter++;


					let JSXSibling = React.createElement(TagName, TagAttributes, [tag_content]);


					//branch_levelJSX.push(<TagName {tag_attributes}>{tag_content}</ TagName>);
					branch_levelJSX.push(JSXSibling);

			    }
			    else if (currPlacement_parsed[i] > nextPlacement_parsed[i]){
			    	//This shouldn't happen since this array is sorted in ascending order.
			    	throw "Error: The next placement bit value is greater than the current value. \
			    	this shouldn't happen if the values are ordered by placement.";
			    }
			}

			return branch_levelJSX;
			//setter will be returned so that 
			}

	}

return JSXArray;
	}



export default IndexHTMLGivenDBData;