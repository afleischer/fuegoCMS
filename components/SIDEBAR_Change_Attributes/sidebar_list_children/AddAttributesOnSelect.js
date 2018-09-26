import React, { Component } from 'react';


class AddAttributesOnSelect extends React.Component{
	constructor(props){
		super(props);

		this.AttributeSelectorList = this.AttributeSelectorList.bind(this);
		this.RemoveAttribue = this.RemoveAttribue.bind(this);
	}


/*===============
Begin functions
===============*/


	/*=============
	Given a clicked value, returns the necessary values in a field 
	=============*/

	AttributeSelectorList(){

		if(this.props.SelectedElement === null || this.props.SelectedElement === undefined){
			return "Click an element to edit its properties."
		}

		var clicked_element = this.props.SelectedElement;
		var returnArray = [];

		//When clicked, get the target's attributes
     	
     	if (clicked_element.hasAttributes()) {
			var attribute_array = clicked_element.attributes;

			////
			//For each attribute in an array, get the attributes 
			////
			for(let i = 0; i < attribute_array.length; i++){
				returnArray.push(
					<div>
						<input type = "name" className = "tag-name-change-attribute">{attributes[i].name}</input> 
						<input className = "tag-value-change-attribute" type = "value">{attributes[i].value}</input>
						<div onClick = {(e) => this.RemoveAttribue} className = "remove_attribute">X</div> 
					</div>
					);
			}
		}
		return(returnArray);
	}	

	RemoveAttribue(event){
		let RefToLoop = firebase.database().ref('pages/'+pageURL+"/tags/").val();
		var toRemove = event.target.previousSibling.previousSibling.innerHTML;

		for(child in RefToLoop){
			if(child.attributes != undefined){
				var childKey = Object.keys(child);

				if(child.attributes === toRemove){
				//remove from firebase
				let removeRef = firebase.database().ref('pages/'+pageURL+"/tags/"+childKey+"/attributes/"+toRemove);
				remove(removeRef);
				}
			}

		}
	}



	render(){
		return(
			<div>{this.AttributeSelectorList}</div>
		)
	}


}


export default AddAttributesOnSelect;