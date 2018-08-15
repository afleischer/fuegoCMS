//var firebase = require('firebase');
import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';


var database = firebase.database();


export default class App extends React.component{
    state = {

	
	//Number of elements
	

    }



    //In render, pass the state of the div down as props to the

    render(){
	return(
	    <CMSContainerTextPost />

	);
    }

    
    
}


/*
BASIC ASCII MOCKUP OF BASIC CMS FUNCTIONALITY:


//


*/


/*============
Basic CMS functionality 
============*/

//
//  Container for updating a text post within the CMS
//


export class CMSContainerTextPost extends React.component{
    constructor(props){
    	super(props);
    	this.updateBlogTextState = this.updateBlogTextState.bind(this);
    	this.sendBlogTextToDB = this.sendBlogTextToDB.bind(this);
    }
    state = {
	blogText : "Enter Text Here"
    }

    //To review: Events in ReactJS
	
	updateBlogTextState() {
		let updateText = event.target.value;
		this.setState({blogText : updateText});
	}
/* 
    updateBlogTextState = (event) => {
		let updateText = event.target.value;
		this.setState({blogText : updateText});
    }

*/ 

	sendBlogTextToDB() {
			let blogEntryCopy = this.state.blogText;
			let currentDateTimeDate = new Date();
		let currentDateTime = currentDateTimeDate.now();

		//Future State: Add what user made the update
		
			database.ref('blogs/' + currentDateTime).set({
			    copy : blogEntryCopy
		});

	}
	/*
    sendBlogTextToDB = () = {
		let blogEntryCopy = this.state.blogText;
		let currentDateTimeDate = new Date();
	let currentDateTime = currentDateTimeDate.now();

	//Future State: Add what user made the update
	
		database.ref('blogs/' + currentDateTime).set({
		    copy : blogEntryCopy
	});

    }
    */

	/*  OLD "UpdateBlog" code
    //Will be triggered onClick 
    UpdateBlog = () => {
	
	//Get the content within the textfield
	
	
	
	//Format to send to Firebase
	
	
	//Send to Firebase (will be stored in ref called 'blogs')
	database.ref('blogs/' + blogEntryCopy).set({
	    //Need to fetch last instance of 
	    
	});

	database.ref('copy-folders/' + copyFolder).set({

	)};

	
	//Clear fields
	
    }
*/
    
    

    render(){
	return(   
		<div> 
			<h2 className = "header">Blog Copy Update </h2>
			//Todo: Add upload button to get file from computer
		    //This will be called "content_upload" 
			<input id = "blog-copy" type = "longtext" placeholder = "Enter Text Here" onChange = {this.updateBlogText}>/* >> TD: set type to  */ </input>
			<button type = "button" onClick = {this.sendBlogTextToDB} id = "submission">SUBMIT POST</button>
		</div>
	);
    }
    
}



/*=============
End Basic CMS Functionality
=============*/

const NavButton = ({onClick}) => {
      <button className = "sidebar-toggler sidebar-toggler-right" style ={{backgroundColor: 'blue',  position: "absolute", margin: "30px"}}type="button" data-toggle="collapse" data-target="#collapsingNavbar" onClick={onClick}>
    <div id="nav-icon1">
      <span></span>
      <span></span>
      <span></span>
    </div>

      </button>
}

const SidebarMenu = ({show}) => <div style = {{visibility : show ? "visible" : "hidden" , backgroundColor : "#565151" , position : "absolute", height : "100vh" , width : "200px"}}> </div>


export class VisualEditor extends React.component{

    //for now, just have new items pop in when selecting from the sidebar. 

    
    render(){
	return(
	    <EditorWindow />
	);
    
	}
}

//code apeing: https://stackoverflow.com/questions/46818687/react-changing-css-property-on-click-arrow-function


//Issue: I'm trying to create a statelss functional component within a class.  Don't. 




    
    export class InnerMenu extends React.component{
	//Can I have a class nested within another class?
	state = {
	    
	}

	//Get functionality now, add form later.

	addDiv = () => {


	    //Pass up the state to App to pass to the VisualEditor
	    //Previously I binded this downwards, so in App I'll need to bind this to this class
	    
		}
    }  
    
export class Sidebar extends React.component{

 state = { 
     sidebarVisible : false,
  }
 

   toggleVisible = () => this.setState(state => ({
         sidebarVisible : !state.sidebarVisible,
   }));

    render(){
	return(
	    <div class = "SidebarDiv">
		<SidebarMenu show = {this.state.sidebarVisible}>
		<InnerMenu />
	    </SidebarMenu>
		<HideShowBtn onClick = {this.toggleVisible} />
	    </div>
	);
    }

}


ReadDOM.render(
	<App />,
    document.getElementbyId('root')
);
