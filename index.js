//var firebase = require('firebase');
//import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

//import firebase from 'firebase';

var firebase = require("firebase/app");
//var database = firebase.database();

require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");


/*============
Firebase authentication
============*/

/********
 Initialize Firebase
********/

var config = {
    apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
    authDomain: "fuegocms.firebaseapp.com",
    databaseURL: "https://fuegocms.firebaseio.com",
    projectId: "fuegocms",
    storageBucket: "fuegocms.appspot.com",
    messagingSenderId: "283527892810"
  };

firebase.initializeApp(config);

/* I'm using Cloud Firestore instead, not this
Firebase realtime DB

ui.start('#firebaseui-auth-container', {
	signInOptions: [
	  firebase.auth.EmailAuthProvider.PROVIDER_ID
	],
	// Other config options...
  });

*/

export default class App extends React.Component{
    state = {

	
	//Number of elements
	

    }



    //In render, pass the state of the div down as props to the

    render(){
	return(
		<div>
	    	<CMSContainerTextPost />
	    	<CMSContainerImageUpload /> 
	    </div>
	);
    }

    
    
}




/*============
Basic CMS functionality 
============*/

//
//  Container for updating a text post within the CMS
//


function NoticeBoxText(props){
	return <div className = {props.class_name}><h2 className = "noticeText">Text Copy Uploaded!</h2></div>;
}


	

export class CMSContainerTextPost extends React.Component{
    constructor(props){
    	super(props);
    	this.updateBlogTextState = this.updateBlogTextState.bind(this);
    	this.sendBlogTextToDB = this.sendBlogTextToDB.bind(this);
    }
    state = {
	blogText : "Enter Text Here",
	noticeVisible : "hiddenBoxImg"
    }
	
	updateBlogTextState() {
		let updateText = event.target.value;
		this.setState({blogText : updateText});
	}

	sendBlogTextToDB() {
			let blogEntryCopy = this.state.blogText;
			let currentDateTimeDate = new Date();
		let currentDateTime = Date.now();

		//Future State: Add what user made the update

			/*****
			Old: Firebase Realtime database update
			*****/		

			
			firebase.database().ref('blogs/' + currentDateTime).set({
			    copy : blogEntryCopy
		});
					this.setState({noticeVisible : "shownBoxImg"});
		setTimeout( () => {this.setState({noticeVisible : "hiddenBoxImg"})} , 3000);
			

			/*****
			New: Cloud Firestore update
			*****/
			/*
			db.collection("blogs").add({
				copy : blogEntryCopy
			})
			.then(function() {
		this.setState({noticeVisible : "shownBoxImg"});
		setTimeout( () => {this.setState({noticeVisible : "hiddenBoxImg"})} , 3000);

			})

			*/

	}

    

    render(){
	return(   
		<div className = "container"> 
			<h2 className = "header">Blog Copy Update </h2>
			<input id = "blog-copy" type = "longtext" placeholder = "Enter Text Here" onChange = {this.updateBlogText} />
			<button type = "button" onClick = {this.sendBlogTextToDB} id = "submission">SUBMIT POST</button>
			<NoticeBoxText class_name = {this.state.noticeBoxText} />
		</div>
	);
    }
    
}


function NoticeBox(props){
	return <div className = {props.class_name}><h2 className = "noticeText">Image Uploaded!</h2></div>;
}

export class CMSContainerImageUpload extends React.Component{

	state = {
		noticeVisible : "hiddenBoxImg"
	}


/*==========
Handle image upload
==========*/

	handleUploadImage(ev){

		ev.preventDefault();

		var currentDateTime = Date.now();
		var storageRef = firebase.storage().ref();
		var imageRef = storageRef.child(currentDateTime);

	/*==========
	Upload file to Firebase
	===========*/
		//File as retrieved from the file API 
		var file = this.refs.image_form.value;
		imageRef.put(file).then(function(snapshot){
			//Pop up element that says "file uploaded!"
		this.setState({noticeVisible : "shownBoxImg"});
		setTimeout( () => {this.setState({noticeVisible : "hiddenBoxImg"})} , 3000);
		});

	}

	render(){
		return(
		<div className = "container">
			<h2>Upload Image </h2>
			<input type="file" refs="image_form" />
			<NoticeBox class_name = {this.state.noticeVisible} />
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


export class VisualEditor extends React.Component{

    //for now, just have new items pop in when selecting from the sidebar. 

    
    render(){
	return(
	    <EditorWindow />
	);
    
	}
}

//code apeing: https://stackoverflow.com/questions/46818687/react-changing-css-property-on-click-arrow-function


//Issue: I'm trying to create a statelss functional component within a class.  Don't. 




    
    export class InnerMenu extends React.Component{
	//Can I have a class nested within another class?
	state = {
	    
	}

	//Get functionality now, add form later.

	addDiv = () => {


	    //Pass up the state to App to pass to the VisualEditor
	    //Previously I binded this downwards, so in App I'll need to bind this to this class
	    
		}
    }  
    
export class Sidebar extends React.Component{

 state = { 
     sidebarVisible : false,
  }
 

   toggleVisible = () => this.setState(state => ({
         sidebarVisible : !state.sidebarVisible,
   }));

    render(){
	return(
	    <div className = "SidebarDiv">
		<SidebarMenu show = {this.state.sidebarVisible}>
		<InnerMenu />
	    </SidebarMenu>
		<HideShowBtn onClick = {this.toggleVisible} />
	    </div>
	);
    }

}


ReactDOM.render(
	<App />,
    document.getElementById('root')
);
