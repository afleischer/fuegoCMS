import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
//import ReactImage from './react.png';
import base from 're-base';

const fetch = require('node-fetch');

var http = require('http');

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
Global variables 
*/

var firebase = require("firebase/app");
//var admin = require("firebase-admin");

firebase.initializeApp(config);



const db = firebase.database();
const dbTextRef = db.ref('blogs/');
const storageRef = firebase.storage().ref();
const databaseImageRef = db.ref('image_data/');
const dbPageRef = firebase.database().ref('pages/');
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
    //this.fetchPagesToEdit = this.fetchPagesToEdit.bind(this);
    this.getCounter = this.getCounter.bind(this);
    this.setPage = this.setPage.bind(this);
  }



    state = {
    TextList : null,
    ImageList : null,
    CurrentEditPage : null,
    }

    //Set listener on data

/*
fetchPagesToEdit(){
    var returnArray = [];
    var snapshot = this.state.PagesSnapshot;

    if(snapshot){
      snapshot.forEach(function (childSnapshot) {
        let pushValue = childSnapshot.val();
        returnArray.push(pushValue);
      });
    }

    this.setState({
      Pages : returnArray
    });
    
    return returnArray;
  }
*/

//


getData(){

}

setPage(e){
  if(!e){
    return "loading...";
  }
    let DropdownSelection = e.target.value;
    this.setState({
      CurrentEditPage : "src/"+DropdownSelection+".html",
      CurrentEditPageHandle : DropdownSelection
    });
}


getCounter(snapshot, path, tag){
  var returnArray = [];
    snapshot.forEach(function (childSnapshot) {
      let tagCount = childSnapshot.val().tag;
      returnArray.push(tagCount);
    });
   return returnArray.length;
}



  setFrameProperties(e, tag, content, style){

    var event = e;
    var child = e.childNodes;
    var imageURL = child.getAttribute("src");
    var pageURL =  document.getElementById('page_selector').value;
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    var pageRefChildImg = pageRef.child('img');
    
    //var nextCounter = pageCount + 1;

    var update = [];

    //Get the current page in the VisualEditor -> Dropdown list

    //use re-base's fetch to fetch the number of tagNames named 'img'
    var counter = 1;


  }


//Get a page state list
  componentDidMount(){

    this.setPage();


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
            <TextAddContainer CurrentEditPageHandle = {this.state.CurrentEditPageHandle} TextArray = {this.state.TextList} />
            <ImageAddContainer CurrentEditPageHandle = {this.state.CurrentEditPageHandle} ImageArray = {this.state.ImageList} />
          </div>

          <div className = "style_content">
            <h1>Style Page Content</h1>
            <StyleContentList CurrentEditPageHandle = {this.state.CurrentEditPageHandle} />
          </div>
      
      </div>

      <button className = "collapse">X</button>

      <div className = "VisualSection">
        <VisualEditor SetPage = {this.setPage} />
      </div>


      </span>
  );
    }

    
    
}




/*============
*
* Content Upload Section of CMS Sidebar
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

  const snapshot = props.snapshot;

  var CurrentEditPageHandle = props.CurrentEditPageHandle;
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
      returnArray.push(<div key = {i}><p className = "CMSTextPreviewMenu">{TextValueDisplayVar[i]}</p><button onClick = { (e) => props.clickFunc(event, 'p', 'font-family: helvetica;', CurrentEditPageHandle, snapshot, TextValueDisplayVar[i])}>Add to Page</button></div>);
    }
    

  } catch (err){
    //return "loading" elements while we wait for Firebase to finish loading
    returnArray.push(<div key = "shutupreact2"><p className = "LoadingText">Loading Copy Entries...</p></div>);
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

    this.addTagToFrame = this.addTagToFrame.bind(this);

  }
  state = {

  }

  /*****
  Begin functions
  *****/

  addTagToFrame(event, tag, style, CurrentEditPageHandle, snapshot, content){

    //Get a reference to the page being edited
    var pageURL =  CurrentEditPageHandle;

    try{
       var pageRef = firebase.database().ref('pages/').child(pageURL);
      var snapshot = snapshot;
    }catch(error){
      return "Loading...";
    }
   
     
    var allTag = "tag_type";

    //To the end, add a tag

    function tagCountFunc(snapshot, pageRef, tag){
      var returnArray = [];
          snapshot.forEach(function (childSnapshot) {
          let tagCount = childSnapshot.val().tag;
          returnArray.push(tagCount);
        });
          return returnArray.length;
    }

        var tagCount = tagCountFunc(snapshot, pageRef, tag);


    /*
    var tagCount = getCounter(snapshot, pageRef, tag);
    var newTagKey = pageRef.push().key;
    var tagCounterAll = getCounter(snapshot, pageRef, allTag);
  */
    //send to Firebase

    var tagData = {
       tags :  [
            {
          tag_type : tag,
          content : content,
          placement : tagCount,
          style : style
        }
          ]
    }

    var updates = {};
      updates['/pages/' + pageURL] = tagData;

    pageRef.update(updates);

  }

  //When loading or when a user adds new content, retrieve a list 
  //of all content from Firebase

  render(){
    return(
      <div>
        <h2> Add Stored Text and Copy</h2>
        <TextItem snapshot = {this.state.TextList} CurrentEditPageHandle = {this.props.CurrentEditPageHandle} clickFunc = {this.addTagToFrame} TextArray = {this.state.TextList} />
      </div>
      );
  }
}



const ImageItem = (props) => {

    var returnArray = [];
    //const storageRef = firebase.storage().ref();
    var Metadata = props.Metadata;
    
    try{
      for(let i = 0; i < Metadata.length; i++){

        var imageName = Metadata[i].image_name;
        var imageUrl = Metadata[i].image_url;
        //onClick = {this.setFrameProperties(e,"img", imageName,"position: relative;")}
        returnArray.push(<div className = "thumbnail_div" key = {i} ><p className = "thumbnail_name">{imageName}</p><img className = "thumbnail" src ={imageUrl} /></div>);
        
      }
    }catch(error){
      returnArray.push(<div key="shutupreact">foo</div>);
    }

return returnArray;

}



export class ImageAddContainer extends React.Component{
  constructor(props){
    super(props);


    const databaseImageRef = db.ref('image_data');
    const storageRef = firebase.storage().ref();


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

    this.addTagToFrame = this.addTagToFrame.bind(this);


  }
  state = {

    image_metadata : null

  }

  addTagToFrame(event, tag, style, CurrentEditPageHandle){

    //Get a reference to the page being edited
    var pageURL =  this.props.CurrentEditPageHandle;

    try{
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    var snapshot = this.state.PagesSnapshot;
    }

    catch(error){
      return "Loading...";
    }
     
    var allTag = "tag_type";

    //To the end, add a tag

    /*
    var tagCount = getCounter(snapshot, pageRef, tag);
    var newTagKey = pageRef.push().key;
    var tagCounterAll = getCounter(snapshot, pageRef, allTag);
  */
    //send to Firebase

    var tagData = {
       tags :  [
            {
          tag_type : tag,
          content : content,
          placement : tagCounter,
          style : style
        }
          ]
    }

    var updates = {};
      updates['/pages/' + newTagKey] = tagData;

    pageRef.update(updates);

  }

  //or I could send this to firebase storage...  


    //TO ADD BELOW ONCE THE TEXTITEM IS CONFIRMED WORKING: 
    // onClick = {this.addTagToFrame(event, 'img', null)}
  render(){
    return(
      <div className = "image_add_container">
        <ImageItem  Metadata = {this.state.image_metadata} />
      </div>
      );
  }

}



const DropdownOptions = (props) => {

  var pages = props.Pages;
  var returnArray = [];

  //returnArray.push(<select id="page_selector">);

  try{
      for(let i = 0; i <= pages.length -1; i++){
    returnArray.push(<option key={i} value={pages[i]}>{pages[i]}</option>);
   } 
  }catch(error){
    returnArray.push(<option key="shhhh" value = "Loading options...">Loading...</option>);
  }
  //returnArray.push(</select>);
  return returnArray;
}


export class GhostElement extends React.Component{
  constructor(props){
    super(props);

    this.ghostFunction = this.ghostFunction.bind(this);
  }


ghostFunction(){
  const snapshot = this.props.Snapshot;

    if(snapshot){
    const currPage = document.querySelector('#page_selector').value;
    var pageTags = [];
    
    snapshot.forEach(function (childSnapshot){
      let testValue = childSnapshot.val();
      if(currPage == Object.keys(testValue.pages)[0]){
      const currPage = document.querySelector('#page_selector').value;

      var tagType_pt1 = testValue.pages
      var tagType_pt2 = tagType_pt1[currPage];
      var tagType = tagType_pt2.tags[0].tag_type;

      var tagStyle_pt1 = testValue.pages
      var tagStyle_pt2 = tagStyle_pt1[currPage];
      var tagStyle = tagStyle_pt2.tags[0].style;
      var tagStyleObj = "{"+tagStyle+"}";
      //var tagStyleObj = JSON.parse(tagStyleString);

      console.log("Objectified tag is:"+ tagStyleObj);

      var tagContent_pt1 = testValue.pages;
      var tagContent_pt2 = tagContent_pt1[currPage];
      var tagContent = tagContent_pt2.tags[0].content;
      
          if(tagType == 'p'){
            pageTags.push(<p styles = {tagStyleObj}>{tagContent}</p>);
          }else if(TagType == 'img'){
            pageTags.push(<img src = {imageSrc}></img>);
          }
        }
    });
     return pageTags;
  }

  return "Loading Content...";
}

  render(){
    return(
      (<div>{this.ghostFunction()}</div>)
      );
    }

}



export class VisualEditor extends React.Component{
  constructor(props){
    super(props);

    //set functions
    //this.setVisualEditorPage = this.setVisualEditorPage.bind(this);
    this.addTagToFrame = this.addTagToFrame.bind(this);
    this.addPage = this.addPage.bind(this);
    //this.setPage = this.setPage.bind(this);
    this.fetchPagesToEdit = this.fetchPagesToEdit.bind(this);
    this.loadIFrame = this.loadIFrame.bind(this);
    this.setHTML = this.setHTML.bind(this);


    //set refs
    this.ghostRef = React.createRef();
    this.iFrameRef = React.createRef();


  //Set Database listeners
  firebase.database().ref('pages/').on('value', snapshot => {
    console.log("this is a breakpiont");
      this.setState({
        PagesSnapshot : snapshot
        });
    });
  }

//Set state
  state = {
    pagesToEdit : null,
    VisualSnapshot : null,
  }

/******************
Begin functions
******************/

//Populate the iFrame with the content.  

//Notice!  This logic has been duplicated into "ghostElement" and will be referenced
//instead in the function setHTML
  loadIFrame(){

 
    const snapshot = this.state.PagesSnapshot;

    if(snapshot){
    const currPage = document.querySelector('#page_selector').value;
    var pageTags = [];
    
    snapshot.forEach(function (childSnapshot){
      let testValue = childSnapshot.val();

      if(currPage == Object.keys(testValue.pages)[0]){

        const currPage = document.querySelector('#page_selector').value;

        console.log('break');

        var TagType = `{testValue.pages.currPage.tags[0].tag_type}`;

        var tagType_pt1 = testValue.pages
        var tagType_pt2 = tagType_pt1[currPage];
        var tagType = tagType_pt2.tags[0].tag_type;

        var tagStyle_pt1 = testValue.pages
        var tagStyle_pt2 = tagStyle_pt1[currPage];
        var tagStyle = tagStyle_pt2.tags[0].style;

        var tagContent_pt1 = testValue.pages;
        var tagContent_pt2 = tagContent_pt1[currPage];
        var tagContent = tagContent_pt2.tags[0].content;
        
          //if (childSnapshot.child('tags')){
          //pageTags.push(<TagType style = {tagStyle}>{tagContent}</TagType>);
          //React.createElement(TagType, {style : tagStyle}, tagContent);
      //}    

    //let editorFrame = document.getElementById('VisualEditorWindow')
    //editorFrame.contentDocument.write(pageTags);

          if(tagType == 'p'){
            pageTags.push(<p style = {tagStyle}>{tagContent}</p>);
          }else if(TagType == 'img'){
            pageTags.push(<img src = {imageSrc}></img>);
          }
        }
    });
   
   /*  
    let editorFrame = document.getElementById('VisualEditorWindow');
    let editorFrameDoc = editorFrame.contentDocument;
    //editorFrameDoc.write(pageTags)

    //editorFrame.postMessage(pageTags, 'http://localhost:8080/', false);

    //editorFrame.contentDocument.write(JSON.stringify(pageTags));
    editorFrame.contentDocument.write(pageTags);
    */


    /***********
    get the outerHTML content of the ghostRef 
    ***********/


      }
    }



  addPage(pageName){
    //get the value of the newPage name
    try{
      var newPage = document.querySelector("#page_addition").value;
    }
    catch(error){
      return false;
    }

    //Add the name of the new page to the database
    const webPrefix = "localhost:8080/src/";
    const webSuffix = ".html"
    var PageToAdd = webPrefix + newPage + webSuffix;
    var dateVar = new Date();
    const pagePathVar = "/"+newPage;

    var snapshot = this.state.PagesSnapshot;




    
    if ((newPage != "") && (newPage != undefined) && (newPage != null)){
    pageRef.set({
      tags :  [
            {
          tag_type : "h1",
          content : "This is a new page!",
          placement : 1,
          style : "font-family: helvetica;"
        }
          ]
      
      });

    }


  }

  fetchPagesToEdit(){
    var returnArray = [];
    var snapshot = this.state.PagesSnapshot;

    if(snapshot){
      snapshot.forEach(function (childSnapshot) {
        //let pushValue = childSnapshot.val();
        let pushValue = Object.keys(childSnapshot.val().pages)[0];
        let testValue = childSnapshot
        returnArray.push(pushValue);
      });
    }
    
    return returnArray;
  }


  setHTML(){
    let ghostRef = this.ghostRef.current;
    let iFrameRef = this.loadIFrame.current;
try{
      let ghostRefTags = ReactDOM.findDOMNode(ghostRef);
      let outerElements = ghostRefTags.outerHTML;

      let editorFrame = document.getElementById('VisualEditorWindow');

    editorFrame.contentDocument.write(outerElements);
    }catch(error){
      console.log("setHTML is loading...");
      return false;


      //TODO: Page Swapping, First page Loading notice


    }

  }


//https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
    //https://firebase.google.com/docs/database/web/read-and-write <- see "updating"
  addTagToFrame(event, tag, style, CurrentEditPageHandle){

    //Get a reference to the page being edited
    var pageURL =  this.state.CurrentEditPage;  
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    var snapshot = this.state.PagesSnapshot;
     
    var allTag = "tag_type";

    //To the end, add a tag

    /*
    var tagCount = getCounter(snapshot, pageRef, tag);
    var newTagKey = pageRef.push().key;
    var tagCounterAll = getCounter(snapshot, pageRef, allTag);
  */
    //send to Firebase

    var tagData = {
       tags :  [
            {
          tag_type : tag,
          content : content,
          placement : tagCounter,
          style : style
        }
          ]
    }

//can also try: https://firebase.google.com/docs/database/web/lists-of-data
    var updates = {};
      updates['/pages/' + newTagKey] = tagData;

    pageRef.update(updates);

  }

//Will be hoisted to parent and passed down 

/* 
  setPage(e){
    //change "PageEdited" to 
    let DropdownSelection = e.target.value;
    this.setState({
      CurrentEditPage : "src/"+DropdownSelection+".html"
    });
  }

  */ 

  componentDidMount(){
    this.loadIFrame();
  }

  render(){
    return(
      <div>
        <select id = "page_selector" onChange = {(e) => {this.props.SetPage(e), this.loadIFrame(), this.setHTML()}}> 
          <DropdownOptions Pages = {this.fetchPagesToEdit()} />
        </select>
        Add Page: <input type = "text" id = "page_addition" name = "Add Page" refs = "add_page_element"></input>
        <input type = "submit" value = "submit" onClick = {this.addPage}></input>
        <Iframe
          id = "VisualEditorWindow"
          url = {this.props.CurrentEditPageHandle}
          ref = {this.iFrameRef}
          width = "calc(100vw - 500px)"
          height = "90vh"
          className = "iframe"
          display="initial" 
          onLoad = {this.setHTML}
          />
          <GhostElement ref={this.ghostRef} PageEditing = {this.props.CurrentEditPageHandle} Snapshot = {this.state.PagesSnapshot} style= "display:none;"/>
      </div>

      );
  }
}




/*============
*
* CMS Styling section
*
============*/ 


const StyleTextCopyList = (props) => {

  //order by child "placement", filter by page id 
  try{
    snapshot = props.snapshot;
    currentPage = props.currentPage;

    //NOTICE: If it fails here, try it when calling the snapshot 
    filteredSnap = snapshot.orderByChild('placement').equalTo(currentPage);
    
    //Feature: list the tags on the page, 

    paragraphArray = [];
    h1Array = [];
    h2Array = [];
    h3Array = [];

    returnArray = [];

    filteredSnap.forEach(function (childSnapshot){
      value = childSnapshot.val();
      //if the child is of the type "p"
      if(childSnapshot.child('p')){
        paragraphArray.push(value);
      }else if(childSnapshot.child('h1')){
        h1Array.push(value);

      }else if(childSnapshot.child('h2')){
        h2Array.push(value);

      }else if(childSnapshot.child('h3')){
        h3Array.push(value);
      }

    });

    returnArray = [(<div><h2 className = "style_subheader">Text Elements ("P" tag)</h2><div className = "style_list">{paragraphArray}</div> </div>), (<div><h2 className = "style_subheader">Large Headers ("h1" tag)</h2><div className="style_list">{h1Array}</div> </div>), (<div><h2 className = "style_subheader">Medium Headers ("h2" tag)</h2><div className = "style_list">{h2Array}</div></div>),(<div><h2 className = "style_subheader">Small Headers ("h3" tag)</h2><div>{h3Array}</div></div>)];

    return returnArray;
  }catch(error){
    return (<div>Loading...</div>);
  }

}

const ImageStyleList = (props) => {


return (<div><p>Under Construction...</p></div>)
}


export class StyleContentList extends React.Component{
  constructor(props){
    super(props);

    //Database listeners
      dbPageRef.on('value', snapshot => {
        this.setState({
          PageSnapshot : snapshot
          });
      });
        db.ref('image_data').on('value', snapshot => {
          this.setState({
            ImageList : snapshot
          });
        });

  }

  //"page/" and "image_data" snapshot
  

  state = {

  }

  StyleBar(){


  }

  render(){
    return(
      <div>
        <StyleTextCopyList currentPage = {this.props.CurrentEditPageHandle} snapshot = {this.state.PageSnapshot} />
        <ImageStyleList ImageList = {this.state.ImageList} />
      </div>
      );
  }
}





export class Dropdown_Style extends React.Component{


  setWebImage(){

  }

  render(){
    return(
      <div></div>

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

module.exports = App;

