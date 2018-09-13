import React from 'react';

import firebase from '../../firebase'


export default class presetLogic extends React.Component{
	constructor(props){
		super(props);
			
	}
	
	//We'll likely use flexbox
		//create a class called "horizontal_scroll"

		/*
		<div className = "horizontal_scroll_container" >
			<div  className = "horizontal_scroll"
		

		Checkbox: "Force scroll before proceeding"
		-> Throws flag to below section when user has finished scrolling

		Not Settable: 
			.horizontal_scroll_container{ 
				display: flex;
			}

		Settable (default values given): 
			--container height
			--Container background color
			--Item background color 

			.hoizontal_scroll_Item{
				
				width: 90%
			}

		*/

	//and we can have multiple "subsections"



	//if chooses to add a "subsecton, add a div"

	//

	render(){
		return(

			<div className="horizontal_scroll_container">
				<HorizontalScrollItem />
			</div>

		);
	}

}