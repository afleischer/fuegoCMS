import React, { Component } from 'react';

import firebase from '../../firebase.js';

import isVoid from '../functions/isVoid';
import getTopPlacement from '../functions/getTopPlacement';


class AddElementsToPage extends React.Component{
	constructor(props){
		super(props);



		this.fetchDescriptor = this.fetchDescriptor.bind(this)
		this.containingItemsAdd = this.containingItemsAdd.bind(this)
		this.formItemsAdd = this.formItemsAdd.bind(this)
		this.AddElementToFB = this.AddElementToFB.bind(this)

	}


	state = {
		containingItemAdded : null,
		formElementAdded : null
	}


	containingItemsAdd(){
		var sectioning_list = ["address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "main", "nav", "section"]
		var returnArray = [];
		for(let i = 0; i < sectioning_list.length; i++){
			returnArray.push(<option value={sectioning_list[i]}>{sectioning_list[i]}</option>)
		}
//
		return(<select onChange = {(event) => this.setState({containingItemsAdd : event.target.value})} name="Container_Tags">{returnArray}</select>)

	}


	formItemsAdd(){
		var sectioning_list = ["button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea"]
		var returnArray = [];
		for(let i = 0; i < sectioning_list.length; i++){
			returnArray.push(<option value={sectioning_list[i]}>{sectioning_list[i]}</option>)
		}

		return(<select onChange = {(e) => this.setState({formElementAdded : event.target.value})} name="Container_Tags">{returnArray}</select>)

	}


	AddElementToFB(type){
		var pageReference = firebase.database().ref('pages'+this.props.currentPage+'/tags/');
		var Tag = type === "contain" ? this.state.containingItemsAdd : this.state.formElementAdded;
		var nextPlacement = getTopPlacment(this.props.currentPage) + 1;

		pageReference.child("attributes").push({
			tag_type : Tag,
			content : "",
			placement : nextPlacement 
		});

	}

	/*==================
	Future feature: Scrape to dynamically pull MDN features
	==================*/


	fetchDescriptor(){
		
		//send AJAX request to get data from MDN 
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET", "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", false);
		xmlhttp.send();
		var data = JSON.parse(xmlhttp.responseText);
	}

	render(){
		return(
			<div id="AddElementsContainer">
				<h2>Add Containing Elements</h2>
					<h3>Add elements that are used to contain other elements and content</h3>
				{this.containingItemsAdd()} <button onClick= {(e) => this.AddElementToFB("contain")}>Add Element</button>
				<h2>Add Form Elements</h2>
					<h3>Add elements that are used to enter and submit items and data</h3>
				{this.formItemsAdd()} <button onClick= {(e) => this.AddElementToFB("form")}>Add Element</button>
			</div>
		)
	}
}

export default AddElementsToPage;