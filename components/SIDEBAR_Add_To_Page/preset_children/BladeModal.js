import React from 'react';

import firebase from '../../../firebase'


export default class BladeModal extends React.Component{
	constructor(props){
		super(props);



	}

	state = {


	}




	render(){

		return(
			<div id = "bladeModal">
				<h4>Blade top:</h4>
					<div name = "flat" onClick = {(e) => this.setState({bladeTopOption : e.target.name})}>Flat</div>
					<div name = "angled" onClick = {(e) => this.setState({bladeTopOption : e.target.name})}>Angled</div>
					<div name = "semicircle" onClick = {(e) => this.setState({bladeTopOption : e.target.name})}>Semi-Circular</div>
					
				<h4>Blade bottom:</h4>
					<div name = "flat" onClick = {(e) => this.setState({bladeBottomOption : e.target.name})}>Flat</div>
					<div name = "angled" onClick = {(e) => this.setState({bladeBottomOption : e.target.name})}>Angled</div>
					<div name = "semicircle" onClick = {(e) => this.setState({bladeBottomOption : e.target.name})}>Semi-Circular</div>

					<button onClick = {() => this.props.submitModal(this.props.snapshot, "Blade", this.props.pageEditing, {topborder: this.state.bladeTopOption, bottomborder : this.state.bladeBottomOption}), () => this.props.closeModal("blade")}>SUBMIT</button>
			</div>
			);
	}

}