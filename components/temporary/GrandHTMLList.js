import React from 'react'
import firebase from '../../firebase'


import IndexHTMLGivenDBData from '../functions/JSXIndexGivenFBDataAlgorithm';

class GrandHTMLList extends React.Component{
	constructor(props){
		super(props);


		/*================
		Initialize database call when constructing component
		=================*/

	firebase.database().ref('pages/'+this.props.CurrentEditPageHandle+'/tags/').orderByChild('placement').on('value', snapshot => {
		this.setState({
			page_snapshot : this.props.CurrentEditPageHandle
		});
	});

	}

	state = {
		page_snapshot : undefined
	}


	render(){
		return(
			<IndexHTMLGivenDBData PagesSnapshot = {this.props.PagesSnapshot} pageURL = {this.props.CurrentEditPageHandle}  />
			);
	}

}


export default GrandHTMLList;