import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
//import ReactImage from './react.png';
import base from 're-base';
import Style from 'style-it';


const fetch = require('node-fetch');

var http = require('http');

/*============
Components
=============*/


import VisualEditor from './components/VisualEditor';



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


setPage(e){
  if(!e){
    try{
     let dropdown_first = document.getElementById('#page_selector').value;
    } catch(error){
        return "loading...";
    }
    if (!dropdown_first){
    }
    this.setState({
      CurrentEditPage : "src/"+dropdown_first+".html",
      CurrentEditPageHandle : dropdown_first
    })
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
    var pageRef = dbPageRef.child(pageURL);
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

