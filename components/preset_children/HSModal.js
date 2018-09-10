import React from 'react';

import firebase from '../../firebase'

export default class HSModal extends React.Component{
	constructor(props){
		super(props);

		this.submitAndClose = this.submitAndClose.bind(this);
	}

	state = {
		selectedScrollOption : null,
		snapshot : null
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
					<div name="Left-Right" onClick = {(e) => {
						this.setState({selectedScrollOption : e.target.parentElement.getAttribute("name")});
						console.log(e.target.parentElement.getAttribute("name"));
					} }><p>Left-to-Right</p></div>
					<div name="Right-Left" onClick = {(e) => this.setState({selectedScrollOption : e.target.parentElement.getAttribute("name")})}><p>Right-to-Left</p></div>
				</div>
				<button onClick = { () => this.submitAndClose()}>SUBMIT</button>
			</div>
			);
	}
}
