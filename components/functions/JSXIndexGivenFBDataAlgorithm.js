
import firebase, {sortedPagesSnapshot} from '../../firebase';

import React from 'react';

import IndexSort from './IndexSort';

//import naturalCompare from './natural_sort';
// the below will be called from tagSnapshot.forEach(){}

/*============
Assemble a list of placement variables that represent the 
placement list.  We will use these to index the HTML tags that we 
pull from the database. 
=============*/

/*================
PlacementSort


=================*/

function isVoid(tag_name){

let tagName = tag_name;
let voidFlag = false;

//Checks to see if the element is one of the W3 spec's void elements.
//https://www.w3.org/TR/html5/syntax.html#void-elements

const Voidlist = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  
  Voidlist.forEach((voidTag) => {
    if(voidTag === tagName) voidFlag = true;
  });

return voidFlag; 
}

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



const IndexHTMLGivenDBData = (props) => {

	let pageURL = props.pageURL;
	let snapshot = props.PagesSnapshot;


	if(!snapshot || snapshot.val() == null || pageURL === null || !pageURL) {
		return(<div>Loading HTML</div>)
	}

	let placementArray_raw = [];

	try{
		var keysList = Object.keys(snapshot.child(pageURL).child('tags').val());
	}catch(error){
		return (<div>Loading HTML</div>)
	}
	var keysListSetter= 0;
	let parentSnap = snapshot.child(pageURL).child('tags').val();

	let theParentTrap = [];

	snapshot = snapshot.child(pageURL).child('tags');

	//Get the placement array to compare stuff to 
	snapshot.forEach(function(childSnapshot){
		placementArray_raw.push(childSnapshot.val().placement)
	});

	let placementArray = IndexSort(placementArray_raw);

	let JSXArray = GetHTML(placementArray, parentSnap);

	return JSXArray;

}

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

function GetHTML(placementArray, parentSnap){
	var setter = 0;
	let returnHTML = [];

	while (setter < placementArray.length){
		function GetNestedHTML(){
			//var AssociatedTagData = parentSnap[Object.keys(parentSnap)[setter]];

			//Get where our corresponding value is in the setter data
			var SetterData = parentSnap[Object.keys(parentSnap)[setter]];

			//var TagName = parentSnap[Object.keys(parentSnap)[j]].tag_type;
				var TagName;
				var TagPlacement;
				var TagContent;
				var TagAttributes;

				var FetchedTagData = function getTagData(){
					var TagData = {
						TagName : null,
						TagPlacement : null,
						TagContent : null,
						TagAttributes : null
					}
					for(let j = 0; j < placementArray.length; j++){
					//For this value, find the corresponding 
					let TestTagData = parentSnap[Object.keys(parentSnap)[j]].placement;
					if(TestTagData === SetterData.placement){
						//get the corresponding values 
						TagData.TagName = parentSnap[Object.keys(parentSnap)[j]].tag_type;
						TagData.TagPlacement = parentSnap[Object.keys(parentSnap)[j]].placement;
						TagData.TagContent = parentSnap[Object.keys(parentSnap)[j]].content;
						TagData.TagAttributes = parentSnap[Object.keys(parentSnap)[j]].attributes;
						}
					}
				return TagData;	
				};


			
			var first = placementArray[setter].toString().split('.');
			try {
			var next = placementArray[setter + 1].toString().split('.');
			}catch(error){
				const TagName = FetchedTagData().TagName;
				const TagAttributes = TagAttributes;
				setter++;
				//return React.createElement(TagName, TagAttributes);
				return React.createElement(FetchedTagData().TagName);
			}

			let max = Math.max(first.length, next.length);

			/*================
			Begin digit comparison
			================*/

			for(let i = 0; i <= max; i++){
				if(first[i] && next[i]) {
					//pass
				}

				if(!first[i] && !next[i]){
					//let siblingHTML = React.createElement(TagName, TagAttributes);
					const TagNameReceived = FetchedTagData().TagName;
					setter++;
					if (!TagNameReceived){
						console.log("TagName undefined at setter:"+setter);
						throw "didn't receive tag name!  There's a scoping issue here..."
					}
					let siblingHTML = isVoid(TagNameReceived) ? React.createElement(TagNameReceived, {src : FetchedTagData().TagContent}) : React.createElement(TagNameReceived, null);
					if( i === 1){
						returnHTML.push(siblingHTML);
					}
				return siblingHTML;
				}

				else if(!first[i] && next[i]){
					const TagName = FetchedTagData().TagName;
					const TagAttributes = FetchedTagData().TagAttributes;
					//const childHTML = GetNestedHTML();
					setter++;
					if (!FetchedTagData().TagName){
						console.log("TagName undefined at setter:"+setter);
						throw "didn't receive tag name!  There's a scoping issue here..."
					}
					//let parentHTML = React.createElement(TagName, TagAttributes, GetNestedHTML());
					let parentHTML = React.createElement(FetchedTagData().TagName, null, [FetchedTagData().TagContent, GetNestedHTML()]);
					if (i === 1){
						returnHTML.push(parentHTML);
					}
				return parentHTML;
				}

				else if(first[i] && !next[i]){
					//let childHTML = React.createElement(TagName, TagAttributes);
					if (!FetchedTagData().TagName){
						console.log("TagName undefined at setter:"+setter);
						throw "didn't receive tag name!  There's a scoping issue here..."
					}
					let childHTML = React.createElement(FetchedTagData().TagName, null);
					setter++;
				return childHTML;
				}
			}
	}
	GetNestedHTML();
	
	}
return returnHTML;
}



export default IndexHTMLGivenDBData;
