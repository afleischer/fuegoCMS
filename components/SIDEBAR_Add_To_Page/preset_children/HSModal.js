import React from 'react';

import firebase from '../../../firebase'

export default class HSModal extends React.Component{
	constructor(props){
		super(props);

		this.submitAndClose = this.submitAndClose.bind(this);
	}

	state = {
		selectedScrollOption : null,
		snapshot : null,
		LRselectedClass : "deselected",
		RLselectedClass : "deselected"
	}

	updateSelection(e){
		if(e.currentTarget.getAttribute("name") === "Left-Right"){
			//de-select
			if(this.state.LRselectedClass === "deselected"){
				this.setState({
					LRselectedClass : "selected",
					RLselectedClass : "deselected"
				});			
			}else if(this.state.LRselectedClass === "selected"){
				this.setState({
					LRselectedClass : "deselected"
				});					
			}
		}
		else if (e.currentTarget.getAttribute("name") === "Right-Left"){
			if(this.state.RLselectedClass === "deselected"){
				this.setState({
					LRselectedClass : "deselected",
					RLselectedClass : "selected"
				});			
			}else if(this.state.LRselectedClass === "selected"){
				this.setState({
					RLselectedClass : "deselected"
				});					
			}
		}
	}


submitAndClose(){
	this.props.submitModal(this.props.snapshot, "HorizontalScroll", this.props.CurrentEditPageHandle, this.state.selectedScrollOption);
	this.props.closeModal("hsModal");
}

	render(){

		return(
			<div id = "hsModal">
				<h4>Scroll direction</h4>
				<p>As the user scrolls down, the content in the section will display...</p>
				<div>
					<div className = {this.state.LRselectedClass} name="Left-Right" onClick = {(e) => {this.updateSelection(e)}} ><p>Left-to-Right</p></div>
					<div className = {this.state.RLselectedClass} name="Right-Left" onClick = {(e) => {this.updateSelection(e)}} ><p>Right-to-Left</p></div>
				</div>
				<button onClick = { () => this.submitAndClose()}>SUBMIT</button>
			</div>
			);
	}
}
