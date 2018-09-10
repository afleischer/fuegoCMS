
import React from 'react';

import firebase from '../firebase'


/*===============
To add next: 


================*/ 

//HorizontalScrollAdd

class HSModal extends React.Component{
	constructor(props){

	this.submitModal = this.submitModal.bind(this);
	}

	state = {
		selectedScrollOption : null
	}




	render(){

		return(
			<div id = "hsModal">
				<h4>Scroll direction</h4>
				<p>As the user scrolls down, the content in the section will display...</p>
				<div>
					<div name="Left-Right" onClick = {(e) => setState({selectedScrollOption : e.target.name})}><p>Left-to-Right</p></div>
					<div name="Right-Left" onClick = {(e) => setState({selectedScrollOption : e.target.name})}><p>Right-to-Left</p></div>
				</div>
				<button onClick = {this.props.submitModal(this.props.snapshot, "HorizontalScroll", this.props.pageEditing, this.state.selectedScrollOption), this.props.closeModal("hsModal")}>SUBMIT</button>
			</div>
			);
	}
}



class BladeModal extends React.Component{
	constructor(props){
		super(props);
	}

	state = {


	}




	render(){

		return(
			<div id = "bladeModal">
				<h4>Blade top:</h4>
					<div name = "flat" onClick = {(e) => setState({bladeTopOption : e.target.name})}>Flat</div>
					<div name = "angled" onClick = {(e) => setState({bladeTopOption : e.target.name})}>Angled</div>
					<div name = "semicircle" onClick = {(e) => setState({bladeTopOption : e.target.name})}>Semi-Circular</div>
					
				<h4>Blade bottom:</h4>
					<div name = "flat" onClick = {(e) => setState({bladeBottomOption : e.target.name})}>Flat</div>
					<div name = "angled" onClick = {(e) => setState({bladeBottomOption : e.target.name})}>Angled</div>
					<div name = "semicircle" onClick = {(e) => setState({bladeBottomOption : e.target.name})}>Semi-Circular</div>

					<button onClick = {this.props.submitModal(this.props.snapshot, "Blade", this.props.pageEditing, {topborder: this.state.bladeTopOption, bottomborder : this.state.bladeBottomOption}), this.props.closeModal("blade")}>SUBMIT</button>
			</div>
			);
	}

}


class PresetAddContainer extends React.Component{
	constructor(props){
		super(props);

		this.startModal = this.startModal.bind(this);
	}

//Pull up a modal when the user clicks on it

startModal(input){

	if(input == "horizontal_scroll"){
		var modal = document.getElementById('hsModal');
		modal.style.display = "block";

	}else if(input == "blade"){
		var modal = document.getElementById('bladeModal');
		modal.style.display = "block";
	}

}


submitModal(snapshot, type, page, subtype){
		//Append the data to firebase


		var newCollections = firebase.database.ref('pages/'+pageEditing+'/collections/'+).push().key;
		//now we have a unique key but haven't declared the section type yet


		//get the highest count of the "Placement" tags to see where this is placed on the page
		try{
			let toplevel_counter = firebase.database().ref('/pages'+pageEditing).tags.orderByValue(placement).limitToLast(1);
			let collection_counter = firebase.database().ref('/pages'+pageEditing.collections.orderByValue(placement).limitToLast(1);
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
				border_bottom: subtype.bladeBottomOption
				placement: counter
			}
		}


		firebase.database.ref('pages/'+pageEditing).collections.update(updateVar);

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
			<div onClick = {this.startModal("horizontal_scroll")}>
				<h3>Type: Horizontal Scroll</h3>
				<p>Description: Section that scrolls horizontally as opposed to vertically when 
				a wuser scrolls down</p>
			</div>
			<div onClick = {this.startModal("blade")>
				<h3>Blade<h3>
				<p>Description: Section of content that sits above fixed-background images</p>
			</div>

			<HSModal  submitModal = {this.submitModal} closeModal = {this.closeModal} snapshot = {this.prop.snapshot} pageEditing = {this.props.pageEditing}/>
			<BladeModal submitModal = {this.submitModal} closeModal = {this.closeModal} snapshot = {this.prop.snapshot} pageEditing = {this.props.pageEditing} />

			)
	}
}





