//var firebase = require('firebase');
//import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

const fetch = require('node-fetch');

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



require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");
require("firebase/storage");



/*
//Importing items for advanced image options
const functions = require('firebase-functions');

const gcs = require('@google-cloud/storage')();
//const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
*/

/*
Global variables 
*/

var firebase = require("firebase/app");
//var admin = require("firebase-admin");

firebase.initializeApp(config);



const db = firebase.database();
const dbTextRef = db.ref('blogs/');
const storageRef = firebase.storage().ref();
const databaseImageRef = db.ref('image_data/');
import Iframe from 'react-iframe';

//const functions = require('firebase-functions');







/*===========
*
* Begin App
*
============*/

export default class App extends React.Component{
	constructor(props){
		super(props);

		this.setFrameProperties = this.setFrameProperties.bind(this);
	}



    state = {
		TextList : null,
		ImageList : null,
		}

    //Set listener on data


	setFrameProperties(tag, content, style){

		var pageURL =  this.state.CurrentEditPage;
		var pageRef = firebase.database().ref('pages/').child(pageURL);
			//var updatePageRef = pageRef.child(pageURL)

			update

			//<$tagName style = '$tagStyle'>tagContent</tagName>

			if(tag = "img"){
				var tagName = 'img'
			}

		pageRef.set({
			    [tagID] : b
		});

	}


    //In render, pass the state of the div down as props to the

    render(){
	return(
		<span className = "app-container">

			<div className = "sidebar">

				<div className = "upload_content">
					<h1>Upload Content </h1>
			    	<CMSContainerTextPost />
			    	<CMSContainerImageUpload /> 
			    </div>

			    <div className = "add_content">
			    	<h1>Add to Page</h1>
			    	<TextAddContainer TextArray = {this.state.TextList} />
			    	<ImageAddContainer ImageArray = {this.state.ImageList} />
			    </div>

			    <div className = "style_content">
			    	<h1>Style Page Content</h1>
			    	<StyleContentList />
			    </div>
			
			</div>

			<button className = "collapse">X</button>

			<div className = "VisualSection">
				<VisualEditor CurrentEditPage = {this.state.CurrentEditPage}/>
			</div>


	    </span>
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
		//const name = dateVar.toDateString() + '-' + file.name;
		const name = file.name;
		console.log("file date modified object is:"+ file.lastModifiedDate);
		const metadata = {
		  "fileType": file.type,
		  "fileName": file.name,
		  "uploadDate": name
	};

		const task = ref.child(name).put(file, metadata);
	task
	  .then(snapshot => snapshot.ref.getDownloadURL())
	  .then((url) => {

		console.log(url);
		const image_date = metadata.uploadDate;
		/*==========
		Send file metadata to realtime database
		==========*/
	    firebase.database().ref('image_data/'+currentDateTimeDate).set({
	    	image_name : metadata.fileName,   	
	    	image_type : metadata.fileType,
	    	image_url : url
	    })
	    //document.querySelector('#someImageTagID').src = url;
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
	console.log("Prop received in individual item is:" + props.TextArray);

	const TextArray = props.TextArray;

	//If Firebase hasn't yet responded by the time this function calls, we need to be 
	//ready to handle the behavior
	var returnArray = []; 
	var TextValueDisplayVar = [];
	
	try{
		const LoadedTest = Object.values(TextArray)[0];
		
		TextArray.forEach(function (childSnapshot) {
			let TextValue = childSnapshot.val().copy;
			TextValueDisplayVar.push(TextValue);
		});

		for(let i = 0; i <= Object.keys(TextArray).length; i++){
			returnArray.push(<div key = {i}><p className = "CMSTextPreviewMenu">{TextValueDisplayVar[i]}</p></div>);
		}
		

	} catch (err){
		//return "loading" elements while we wait for Firebase to finish loading
		returnArray.push(<div><p className = "LoadingText">Loading Copy Entries...</p></div>);
	}

	return returnArray;

}


export class TextAddContainer extends React.Component{
	constructor(props){
		super(props);

	//this.RetrieveText = this.RetrieveText.bind(this);

		/*============
		Set Firebase listener for text values
		=============*/
		dbTextRef.on('value', snapshot => {
    	this.setState({
    		TextList : snapshot
    		});
		});


	}
	state = {

	}

	//When loading or when a user adds new content, retrieve a list 
	//of all content from Firebase

	render(){
		return(
			<div>
				<h2> Add Stored Text and Copy</h2>
				<TextItem TextArray = {this.state.TextList} />
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



/*
class ImageItem extends React.Component{


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
*/

/*
class ImageItem extends React.Component {
	constructor(props){
		super(props);
		this.getArray = this.getArray.bind(this);
	}
	state = {
		returnArrayState : []
	}

	getArray(props){
		var props = this.props;
		var returnArray = [];
		const storageRef = firebase.storage().ref();
		var name = props.image_metadata;
		
		try{
			for(let i = 0; i < props.ImageVar.length; i++){
				
				storageRef.child(props.ImageVar[i]).getDownloadURL().then(function(url) {
					console.log("The server got:"+url);
					gcs.bucket.file(url)
					returnArray.push(<div className = "thumbnails_loaded"><img className = "thumbnail" src ={url} /></div>);
					 this.setState({
						returnArrayState : joined
					}); 
					//returnArray.push(<div className = "thumbnails_loaded"><img className = "thumbnail" src ={url} /></div>);
				});
			}
		}catch(error){
		returnArray.push(<div className ="thumbnails_loading"key="shutupreact">Loading images...</div>);
			this.setState({
				returnArrayState : loadingMessage
			}); 
		}
	};

	render(){
		return(
			{returnArray}
		);
	}
}

*/

/*
const ImageItem = (props) =>{

		var returnArray = [];
		//const storageRef = firebase.storage().ref();
		var name = props.Metadata;
		
		try{
			for(let i = 0; i < Metadata.length; i++){
				storageRef.child(props.ImageVar[i]).getDownloadURL().then(function(url) {
					console.log("The server got:"+url);
					returnArray.push(<div className = "thumbnail_div"><img className = "thumbnail" src ={url} /></div>);
				});
			}
		}catch(error){
			returnArray.push(<div key="shutupreact">foo</div>);
		}

return returnArray;

}
*/

const ImageItem = (props) => {

		var returnArray = [];
		//const storageRef = firebase.storage().ref();
		var Metadata = props.Metadata;
		
		try{
			for(let i = 0; i < Metadata.length; i++){

				var imageName = Metadata[i].image_name;
				var imageUrl = Metadata[i].image_url;
				
				returnArray.push(<div className = "thumbnail_div"><p className = "thumbnail_name">{imageName}</p><img className = "thumbnail" src ={imageUrl} /></div>);
				
			}
		}catch(error){
			returnArray.push(<div key="shutupreact">foo</div>);
		}

return returnArray;

}




/*

	//for each name in props.image_metadata


	storageRef.forEach(function(snapshot){
		storageRef.child(snapshot.image.imageName).getDownloadURL().then(function(url) {
			returnArray.push(<div className = "thumbnail_div"><img className = "thumbnail" src ={url} /></div>);
		});
	});
	return returnArray;
	
		return returnArray;

}
*/

export class ImageAddContainer extends React.Component{
	constructor(props){
		super(props);


		const databaseImageRef = db.ref('image_data');
		const storageRef = firebase.storage().ref();


		//within databaRef, for each image_data child get the image_url
		//

		var stateArray = [];
		
		var iterator = 1;


		
	databaseImageRef.on("value", snapshot => {
		var metadata_array = [];
			snapshot.forEach(function (childSnapshot) {
				var RDB_image_name = childSnapshot.val().image_name;
				var RDB_image_url = childSnapshot.val().image_url;
				metadata_array.push(
					{image_name : RDB_image_name,
					image_url : RDB_image_url}
					);
			});

			this.setState({
				image_metadata : metadata_array
			});
			
	});

//can also try onChange
/*
	const generateThumbnail = functions.storage.object().onFinalize((object) => {
		
	});
*/


	}
	state = {

		image_metadata : null

	}

	//or I could send this to firebase storage...  

	getImagePreview(){

		/***********
	
		Old code- this can be useful for getting thumbnails off of the desktop, but we're loading from the server
		FileReader() object lets web apps async read file contents on computer via File/Blob objects

		// 1. First, get a list of the files by referencing the location and lo
	
		var storageRef = firebase.storage().ref();
		var imageArray = [];

		function appendObjTo(thatArray, newObj) {
			const frozenObj = Object.freeze(newObj);
			return Object.freeze(thatArray.concat(frozenObj));
			}


		// 1. First, get a list of the files by referencing the location and lo
		for(key in storageRef){
			//need to get a file object for each
			//imageArray.push(snapshot.val());

			appendObjTo(imageArray, {name_prop : snapshot.val(), thumbnail_prop : snapshot.val() })
		}

		//reader.onloadend = function(){

		return imageArray;	
			************/

	}

componentDidMount(){
	console.log("State update finished");
}

	render(){
		return(
			<div className = "image_add_container">
				<ImageItem Metadata = {this.state.image_metadata} />
			</div>
			);
	}

}

export class StyleContentList extends React.Component{

	render(){
		return(
			
			<div></div>
			);
	}

}

/*============
*
* CMS Styling section
*
============*/ 


export class Dropdown_Style extends React.Component{


	setWebImage(){

	}

	render(){
		return(
			<div></div>

			);
	}
}

const DropdownOptions = (props) => {

	var pages = props.Pages;
	var returnArray = [];

	//returnArray.push(<select id="page_selector">);

	for(let i = 0; i <= pages.length -1; i++){
		returnArray.push(<option value={pages[i]}>{pages[i]}</option>);
	}

	//returnArray.push(</select>);
	return returnArray;
}

/*========================================
Data schema mockup 
pages/ 
	page_url
		{ key
		tag
		placement
		style }
		{ key 
		tag
		placement
		style }
	page_url	
		...

========================================*/ 

export class VisualEditor extends React.Component{
	constructor(props){
		super(props);

		//this.setVisualEditorPage = this.setVisualEditorPage.bind(this);
		this.setFrameProperties = this.setFrameProperties.bind(this);
		this.addPage = this.addPage.bind(this);
		this.setPage = this.setPage.bind(this);
		this.fetchPagesToEdit = this.fetchPagesToEdit.bind(this);

		firebase.database().ref('pages/').on('value', snapshot => {
			console.log("This is a breakpoint!");
			
			/*  I'm going to handle dealing with the snapshot as needed in the VisualEditor
			var pageArray = [];

			snapshot.forEach(function(childSnapshot) {
				var url = snapshot.child().val().;
			});
    	this.setState({
    		pagesToEdit : derp,
    		VisualSnapshot : snapshot
    		});
			*/
		});
	}

//NOTICE!  CurrentEditPage will be hoisted up 
	state = {
		pagesToEdit : null,
		VisualSnapshot : null,
		CurrentEditPage : null

	}

//Here's the real meat of this.  
	VisualLogic(){

	}


	addPage(pageName){
		//get the value of the newPage name
		var newPage = querySelector("#page_addition").value;

		//Add the name of the new page to the database
		const webPrefix = "localhost:8080/src";
		const webSuffix = ".html"

		var PageToAdd = webPrefix + newPage + webSuffix;

		//send to FB
		var pageRef = firebase.database().ref('pages/'+PageToAdd);
		pageRef.set({
			page_name : newPage,
			tags :  [
				{
					tagName : header1,
					tag_type : h1,
					placement : 1,
					style : "font-family: helvetica;"
				}
					]
			


		});

	}

	fetchPagesToEdit(){
		var pages = firebase.database().ref('pages/').child();
		var returnArray = [];

		pages.forEach(function(value){
			returnArray.push(value);
		});
	}


	setFrameProperties(tag, content, ev){

		var pageURL =  this.state.CurrentEditPage;
		var pageRef = firebase.database().ref('pages/').child(pageURL);
			//var updatePageRef = pageRef.child(pageURL)

		pageRef.set({
			    content : blogEntryCopy
		});

	}

	setPage(e){
		//change "PageEdited" to 
		let DropdownSelection = e.target.value;
		this.setState({
			CurrentEditPage : DropdownSelection
		});
	}

	render(){
		return(
			<div>
				<select id = "page_selector" onChange = {(e) => this.setPage(e)}> 
					<DropdownOptions Pages = {this.state.pagesToEdit} />
				</select>
				Add Page: <input type = "text" id = "page_addition" name = "Add Page" refs = "add_page_element"></input>
				<input type = "submit" value = "submit" onClick = {this.addPage()}></input>
				<Iframe
					id = "VisualEditor"
					url = {this.state.CurrentEditPage}
					width = "calc(100vw - 500px)"
					height = "90vh"
					className = "iframe"
					display="initial" />
			</div>

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



