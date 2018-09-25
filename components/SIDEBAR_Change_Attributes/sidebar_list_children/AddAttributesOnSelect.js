import React, { Component } from 'react';


class AddAttributesOnSelect extends React.Component{
	constructor(props){
		super(props);

		this.AttributeSelectorList = this.AttributeSelectorList.bind(this)
	}


/*===============
Begin functions
===============*/


	/*=============
	Given a clicked value, returns the necessary values in a field 
	=============*/

	AttributeSelectorList(event){

		var clicked_element = event.target;
		var returnArray = [];

		//When clicked, get the target's attributes
     	
     	if (clicked_element.hasAttributes()) {
			var attribute_array = clicked_element.attributes;

			////
			//For each attribute, get the attributes 
			////
			for(let i = 0; i < attribute_array.length; i++){
				returnArray.push(<div>
					<input type = "name" className = "tag-name-change-attribute">{attributes[i].name}</input> 
					<input className = "tag-value-change-attribute" type = "value">{attributes[i].value}</input>
					</div>
					);
			}

		}


		tag_list = []

		return(returnArray);

	}	

	render(){
		return(
			<div>{this.AttributeSelectorList}</div>
		)
	}


}


export default AddAttributesOnSelect;