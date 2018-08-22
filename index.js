//var firebase = require('firebase');
//import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

//import firebase from 'firebase';

/*
Global variables 
*/

var firebase = require("firebase/app");
//var admin = require("firebase-admin");


//var db = admin.database();


require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");
require("firebase/storage");



/*============
Firebase initialization
============*/

	var config = {
	    apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
	    authDomain: "fuegocms.firebaseapp.com",
	    databaseURL: "https://fuegocms.firebaseio.com",
	    projectId: "fuegocms",
	    storageBucket: "fuegocms.appspot.com",
	    messagingSenderId: "283527892810"
	  };

	firebase.initializeApp(config);


/*===========
*
* Begin App
*
============*/

export default class App extends React.Component{
	constructor(props){
		super(props);
		this.setTextListener = this.setTextListener.bind(this);
		this.setImageListener = this.setImageListener.bind(this);

	}
    state = {
		TextList : null,
		ImageList : null
    }

    setTextListener(){
    	var TextRef = firebase.database().ref('blogs/');
		
		TextRef.on('value', function(snapshot) {
  			this.setState({
  				TextList : snapshot.val()
  			});
		});
    }

    setImageListener(){
    	var ImageRef = firebase.storage().ref();

    	ImageRef.on()
    }


    //In render, pass the state of the div down as props to the

    render(){
	return(
		<div>

			<div className = "sidebar">

				<div className = "upload_content">
					<h1>Upload Content </h1>
			    	<CMSContainerTextPost />
			    	<CMSContainerImageUpload /> 
			    </div>

			    <div className = "add_content" onLoad = {this.setTextListener}>
			    	<h1>Add to Page</h1>
			    	<TextAddContainer TextArray = {this.state.TextList} />
			    	<ImageAddContainer ImageArray = {this.state.ImageList} />
			    </div>

			    <div className = "style_content">
			    	<h1>Style Page Content</h1>
			    	<StyleContentList />
			    </div>
			
			</div>

			<div className = "VisualSection">
				<Dropdown />
				<VisualEditor />
			</div>

			<button className = "collapse">X</button>
	    </div>
	);
    }

    
    
}




/*============
*
*	Content Upload Section of CMS Sidebar
*
============*/



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
	
	updateBlogTextState(ev) {
		
		//let updateText = event.target.value;
		let updateText = ev.target.value;
		this.setState({blogText : updateText});
		console.log(event);
	}

	sendBlogTextToDB() {
			let blogEntryCopy = this.state.blogText;
			let currentDateTimeDate = new Date();
		let currentDateTimeRaw = Date.now();
		let currentDateTime = currentDateTimeDate.toDateString();

			/*****
			Add text to Firebase
			*****/		

			
			firebase.database().ref('blogs/' + currentDateTime).set({
			    copy : blogEntryCopy
		});
			/****
			Hide and show the "Text Copy Updated!"" NoticeBox
			****/
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
			<h2 className = "header">ADD TEXT</h2>
			<textarea id = "blog-copy" rows = "4" cols = "50" type = "longtext" placeholder = "Enter Text Here" onBlur = {this.updateBlogTextState} />
			<br />
			<button type = "button" onClick = {this.sendBlogTextToDB} id = "submission">SUBMIT</button>
			<NoticeBoxText class_name = {this.state.noticeVisible} />
		</div>
	);
    }
    
}


function NoticeBox(props){
	return <div className = {props.class_name}><h2 className = "noticeText">Image Uploaded!</h2></div>;
}

export class CMSContainerImageUpload extends React.Component{
	constructor(props){
		super(props);
		this.handleUploadImage = this.handleUploadImage.bind(this);
		this.setFile = this.setFile.bind(this);
	}
	state = {
		noticeVisible : "hiddenBoxImg",
		toUpload : "null"
	}

	/*============
	Update state to reflect the file to upload 
	=============*/
	setFile(ev){

		var file = ev.target.files[0];
		console.log("File is:" +file);
		this.setState({
			toUpload : {file}
		},
		function () {console.log("Updated state is:" + this.state.toUpload); } );

	}

	/*==========
	Handle image upload
	==========*/

	handleUploadImage(ev){

		ev.preventDefault();

		var currentDateTimeDate = new Date();
		var currentDateTime = currentDateTimeDate.toDateString();

		var storageRef = firebase.storage().ref();
		var imageRef = storageRef.child(currentDateTime);

	/*==========
	Upload file to Firebase
	===========*/

		const ref = firebase.storage().ref();

		const file = document.querySelector('#image_field').files[0];
			console.log("file sent is:" + file);

		var dateVar = new Date;
		//const name = (+new Date()) + '-' + file.name;
		const name = dateVar.toDateString() + '-' + file.name;
		const metadata = {
		  contentType: file.type
	};

		const task = ref.child(name).put(file, metadata);
	task
	  .then(snapshot => snapshot.ref.getDownloadURL())
	  .then((url) => {
	    console.log(url);
	    document.querySelector('#someImageTagID').src = url;
	  })
	  .catch(console.error);


	this.setState({noticeVisible : "shownBoxImg"});
		setTimeout( () => {this.setState({noticeVisible : "hiddenBoxImg"})} , 3000);
//End alternate code
	}

	render(){
		return(
		<div className = "container">
			<h2>UPLOAD IMAGE</h2>
			<input id = "image_field" type="file" refs="image_form" onInput = {this.setFile} />
			<button type = "button" onClick = {this.handleUploadImage} id = "img_submission">SUBMIT</button>
			<NoticeBox class_name = {this.state.noticeVisible} />
		</div>

		);
	}
}


	/*=============
	End Upload Section
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

/*==========
**
** "Add Content" Section of CMS Sidebar
**
===========*/

//if displayText is an array of []


const TextItem = (props) => {
	const TextArray = props.TextArray;
	const TextValues = Object.values(TextArray[0]);



	const returnArray = TextArray.map(() => {
		<div>
			<p>{this.props.TextArray}</p>
		</div>
	});

	return returnArray;
} 


/* 
class TextItem extends React.Component{

	//This function will likely be moved elsewhere
	getTextCopyValues(){

		let CopyArray = Object.values(this.props.TextArrayVar[0]);


		CopyArray.map()

			<div>
				<p>{this.props.textValue}</p>
			</div>

		return 

	}


	render(){
		return(
			<div>
				<p>{this.props.textValue}</p>
			</div>
		);
	}
}
*/ 


export class TextAddContainer extends React.Component{
	state = {

	}

	componentWillMount(){
		let theValue = RetrieveText();
		this.setState({TextRetrieved : theValue})
	}

	//When loading or when a user adds new content, retrieve a list 
	//of all content from Firebase

	RetrieveText(){
    	var TextRef = firebase.database().ref('blogs/');
    	console.log("TextRef keys are:"+Object.keys(TextRef));
    	var TextArrayVar = [];

    	TextRef.once('value').then(function(snapshot){ //remember, we have child data that we listen for here
			TextArrayVar.push(snapshot.val());	
			console.log("snapshot is:" + Object.values(theSnapshot));	
			/*
			for(snapshot.key in snapshot){
				TextArrayVar.push(snapshot.val());
			}

			for(let i = 0; i <= snapshot.length; i++){
				TextArrayVar.push(snapshot.val());
			}
			*/
    	});
    	console.log("Updated TextArrayVar is:"+ TextArrayVar);
		return TextArrayVar;
	}


	render(){
		return(
			<div onLoad = {this.RetrieveText}>
				<Dropdown />
				<TextItem TextArray = {this.state.TextRetrieved} />
				<button onClick = {this.RetrieveText}>Refresh</button>
			</div>
			);
	}
}

/*
const ImageItem = ImageVar.map((ImageVar) => {
	//Do functional components have props?
	<div>
		<img src = {this.props.ImageVar.name_prop}>
		</img>
		<p>{this.props.ImageVar.thumbnail_prop}</p>
	</div>
});
*/ 

class ImageItem extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				<img src = {this.props.ImageVar.name_prop}>
				</img>
				<p>{this.props.ImageVar.thumbnail_prop}</p>
			</div>

		);
	}
}

export class ImageAddContainer extends React.Component{
	state = {

	}

	getImagePreview(){



		/***********
		The idea:

		FileReader() object lets web apps async read file contents on computer via File/Blob objects

		// 1. First, get a list of the files by referencing the location and lo
		************/

		var storageRef = firebase.storage().ref();
		var imageArray = [];

		/*
		Firebase data structure: 

			
		*/ function appendObjTo(thatArray, newObj) {
			const frozenObj = Object.freeze(newObj);
			return Object.freeze(thatArray.concat(frozenObj));
			}


		// 1. First, get a list of the files by referencing the location and lo
		for(key in storageRef){
			//need to get a file object for each
			//imageArray.push(snapshot.val());

			appendObjTo(imageArray, {name_prop : snapshot.val(), thumbnail_prop : snapshot.val() })
		}

		console.log(imageArray);
		//reader.onloadend = function(){

		return imageArray;	

	}


	render(){
		return(

			<ImageItem ImageVar = {this.getImagePreview}/>
			);
	}

}

export class StyleContentList extends React.Component{

	render(){
		return(
			
			<div>foo</div>
			);
	}

}

/*============
*
* CMS Styling section
*
============*/ 


export class Dropdown extends React.Component{

	render(){
		return(
			<div>foo</div>

			);
	}
}

export class VisualEditor extends React.Component{


	render(){
		return(
			<div>foo</div>

			);
	}
}



/*============
Render the Virtual DOM
============*/

ReactDOM.render(
	<App />,
    document.getElementById('root')
);



