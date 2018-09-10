
import React from 'react';

import firebase from '../firebase'

import '../style.css'

/*=============
Children
=============*/

import HSModal from './preset_children/HSModal';
import BladeModal from './preset_children/BladeModal';


class PresetAddContainer extends React.Component{
	constructor(props){
		super(props);

		this.startModal = this.startModal.bind(this);
		this.submitModal = this.submitModal.bind(this);
		this.closeModal = this.closeModal.bind(this);



		/*==============
		Set db listener
		==============*/
		firebase.database().ref('pages/').on('value', snapshot => {
			this.setState({
				snapshot: snapshot
			});
	    });

	}

	state = {

	}

//Pull up a modal when the user clicks on it

startModal(input){

	try{

		if(input == "horizontal_scroll"){
		var modal = document.getElementById('hsModal');
		modal.style.display = "block";

	}else if(input == "blade"){
		var modal = document.getElementById('bladeModal');
		modal.style.display = "block";
	}

	}catch(error){

	}

}


submitModal(snapshot, type, page, subtype){
		//Append the data to firebase

	if(!snapshot){
		return false;
	}
		var pageEditing = page;

		var newCollections = firebase.database().ref('pages/'+pageEditing+'/collections/').push().key;
		//now we have a unique key but haven't declared the section type yet


		//get the highest count of the "Placement" tags to see where this is placed on the page
		try{

			var toplevel_counter = firebase.database().ref('pages/' + pageEditing+'/tags/').orderByChild('placement').limitToLast(1);
			let collection_counter = firebase.database().ref('/pages'+pageEditing).collections.orderByValue(placement).limitToLast(1);
		}catch(error){
			if(!toplevel_counter && !collection_counter){
				counter = 1;
			}
		}


			if (toplevel_counter > collection_counter){
				let counter = toplevel_counter;
				counter++;
			}else if (collection_counter > toplevel_counter){
				let counter = collection_counter;
				counter++;
			}

		//var newCollectionsKey = firebase.database.ref('pages/'+pageEditing).tags.push().key;

		//get a list of keys within the "tags"
		if(subtype == "Left-Right" || subtype == "Right-Left"){
			var updateVar = {
				type: "HorizontalScroll",
				traversal: type,
				placement: counter
			};
		}
		else if (subtype == "Flat" || subtype == "Angled" || subtype == "Semi-Circular" || subtype == "Custom"){
			var updateVar = {
				type: "Blade",
				border_top: subtype.bladeTopOption,
				border_bottom: subtype.bladeBottomOption,
				placement: counter
			}
		}


		firebase.database().ref('pages/'+pageEditing).collections.update(updateVar);

	}


	closeModal(input){

		if(input == "horizontal_scroll"){
			var modal = document.getElementById('hsModal');
			modal.style.display = "none";

		}else if(input == "blade"){
			var modal = document.getElementById('bladeModal');
			modal.style.display = "none";
		}
	}

	render(){
		return(
			<div className = "PresetContainer">
				<h1>Add Preset</h1>
				<div onClick = {this.startModal("horizontal_scroll")}>
					<h3>Type: Horizontal Scroll</h3>
					<p>Description: Section that scrolls horizontally as opposed to vertically when 
					a wuser scrolls down</p>
					<HSModal CurrentEditPageHandle = {this.props.CurrentEditPageHandle}  submitModal = {this.submitModal} closeModal = {this.closeModal} snapshot = {this.state.snapshot} pageEditing = {this.props.pageEditing}/>

				</div>
				<div onClick = {this.startModal("blade")}>
					<h3>Type: Blade</h3>
					<p>Description: Section of content that sits above fixed-background images</p>
				</div>
					<BladeModal CurrentEditPageHandle = {this.props.CurrentEditPageHandle} submitModal = {this.submitModal} closeModal = {this.closeModal} snapshot = {this.state.snapshot} pageEditing = {this.props.pageEditing} />

			</div>
			);
	}
}

export default PresetAddContainer;