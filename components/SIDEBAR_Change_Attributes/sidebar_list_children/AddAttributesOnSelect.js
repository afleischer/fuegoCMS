import React, { Component } from 'react';

import firebase from '../../../firebase.js';


class AddAttributesOnSelect extends React.Component{
	constructor(props){
		super(props);

		this.AttributeSelectorList = this.AttributeSelectorList.bind(this);
		this.RemoveAttribue = this.RemoveAttribue.bind(this);
		this.UpdateAttribute = this.UpdateAttribute.bind(this);
		this.AddAttribute = this.AddAttribute.bind(this);
		this.AdditionalAttributes = this.AdditionalAttributes.bind(this);
		this.AddFreshAttributeToDB = this.AddFreshAttributeToDB.bind(this);
	}

	state = {
		attributeLines : 0
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
						<label for={attribute_array[i]}>{attribute_array[i].name}</label>
						<input onChange ={(e) => this.UpdateAttribute(e)} type = "name" name = {attribute_array[i].value} value = {attribute_array[i].value} className = "tag-name-change-attribute" />
						<button onClick = {(e) => this.RemoveAttribue(e)} className = "remove_attribute">Remove Attribute</button> 
					</div>
					);
			}
		}
		return(<div className = "attribute-selector-sub-container">{returnArray}
			{this.AdditionalAttributes()}
			 <button onClick = {(e) => this.setState({attributeLines : this.state.attributeLines + 1}) }>Add new attribute</button> 
			 <button onClick = {(e) => this.setState({attributeLines : this.state.attributeLines - 1}) }> Remove attribute line</button>
			}
			</div>);
	}	

	RemoveAttribue(event){
		var pageURL = this.props.currentPage;
		let RefToLoop = firebase.database().ref('pages/'+pageURL+"/tags/");
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

		toRemove.removeChild();
	}

	UpdateAttribute(){
		var pageURL = this.props.currentPage;
		var toUpdate = event.target.name;
		var targetData = event.target;
		const RefToLoop = firebase.database().ref('pages/'+pageURL+"/tags/");
		var RefBase = firebase.database().ref('pages/'+pageURL+"/tags/")


		for(child in RefToLoop){
			if(child.attributes != undefined){
				var childKey = Object.keys(child);

				if(child.attributes === toUpdate){
					//remove from firebase
					let updateRef = firebase.database().ref('pages/'+pageURL+"/tags/"+childKey+"/attributes/"+toUpdate);
					var updates = {
						[toUpdate] : targetData.value
					}
					updateRef.update(updates);
				}
			}
		}
	}

	AddAttribute(){
		var pageURL = this.props.currentPage;
		var toUpdate = event.target.previousSibling.name;
		var targetData = event.target;
		const RefToLoop = firebase.database().ref('pages/'+pageURL+"/tags/");
		var RefBase = firebase.database().ref('pages/'+pageURL+"/tags/")


		for(child in RefToLoop){
			if(child.attributes != undefined){
				var childKey = Object.keys(child);

				if(child.attributes === toUpdate){
					//remove from firebase
					let updateRef = firebase.database().ref('pages/'+pageURL+"/tags/"+childKey+"/attributes/"+toUpdate);
					var updates = {
						[toUpdate] : targetData.value
					}
					updateRef.update(updates);
				}
			}
		}
	}

	AddFreshAttributeToDB(event){
		var pageURL = this.props.currentPage;
		var attribute_name = event.target.previousSibling.previousSibling.previousSibling.value;
		var attribute_value = event.target.previousSibling.value;
		const RefToLoop = firebase.database().ref('pages/'+pageURL+"/tags/");

		RefToLoop.once('value', snapshot => {

			var keysToLoop = Object.keys(snapshot.val());

			for(let i = 0; i < keysToLoop.length; i++){
				//make sure there is an attributes field
				if(snapshot.child(keysToLoop[i]).val().attributes){
					let attributesLoop = snapshot.child(keysToLoop[i]).child('attributes');
					//for each of these, 

					attributesLoop.forEach( function(attributesSnapshot){
						
						
					}


						);
				} 


			}

			if(snapshot.attributes != undefined){
				var childKey = Object.keys(child);

				if(child.attributes === attribute_name){

					var newLoopRef = RefToLoop.child(attribute_name);

					for(attribute in newLoopRef){
						if(attribute.value === attribute_value){
						//remove from firebase
						let updateLoopRef = firebase.database().ref('pages/'+pageURL+"/tags/"+childKey+"/attributes/"+attribute);
						var updates = {
							[attribute_name] : attribute_value
							}
						updateRef.update(updates);
						console.log("Submitted!");
						}	
					}
				}
			}
		})
	}

	AdditionalAttributes(){
		var returnArray = []
		for(let i = 0; i < this.state.attributeLines; i++){
			returnArray.push(
				<div>
				Attribute name:<input name="AddAttribute_name" />
				Attribute value:<input name="AddAttribute_value"  />
				<button onClick = {(e) => {this.AddFreshAttributeToDB(e)}}>Submit Attribute</button>
				</div>)
		}
		return returnArray;
	}

	ComponentDidUpdate(){
		AttributeSelectorList();
	}

	render(){
		return(
			<div>{this.AttributeSelectorList()}</div>
		)
	}


}


export default AddAttributesOnSelect;