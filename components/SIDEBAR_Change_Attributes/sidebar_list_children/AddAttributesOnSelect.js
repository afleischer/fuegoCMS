import React, { Component } from 'react';


class AddAttributesOnSelect extends React.Component{
	constructor(props){
		super(props);

		this.AttributeSelectorList = this.AttributeSelectorList.bind(this);
		this.RemoveAttribue = this.RemoveAttribue.bind(this);
		this.UpdateAttribute = this.UpdateAttribute.bind(this);
		this.AddAttribute = this.AddAttribute.bind(this);
		this.AdditionalAttributes = this.AdditionalAttributes.bind(this);
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
			<input name="AddAttribute" onClick = {(e) => {this.AddAttribute(e)}} />
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

	AdditionalAttributes(){
		var returnArray = []
		for(let i = 0; i < this.state.attributeLines; i++){
			returnArray.push(<input name="AddAttribute" onClick = {(e) => {this.AddAttribute(e)}} />)
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