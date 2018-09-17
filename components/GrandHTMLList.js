import React from 'react'
import firebase from '../firebase'


import IndexHTMLGivenDBData from './functions/JSXIndexGivenFBDataAlgorithm';

class GrandHTMLList extends React.Component{
	constructor(props){
		super(props);


		/*================
		Initialize database call when constructing component
		=================*/

		firebase.database().ref('pages/' +this.props.CurrentEditPageHandle+'/tags/').orderByChild('placement').on('value', (snapshot) => {
			this.setState({
				page_snapshot : this.props.CurrentEditPageHandle
			});
		});

	}

	state = {

	}


	render(){
		return(
			<IndexHTMLGivenDBData PagesSnapshot = {this.state.page_snapshot} pageURL = {this.props.CurrentEditPageHandle}  />
			);
	}

}


export default GrandHTMLList;