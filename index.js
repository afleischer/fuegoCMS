import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import base from 're-base';
import Style from 'style-it';
import Iframe from 'react-iframe';

import firebase from './firebase.js';
//import firebase from 'firebase/app';

/*==============
Initialize firebase 
===============*/

//import './db_init';

//import {importFirebase} from 'firebase';


/* 
import * as firebase from 'firebase';
  import 'firebase/auth';
  import 'firebase/database';
  import 'firebase/firestore';
  import 'firebase/messaging';
  import 'firebase/functions';
  import 'firebase/storage';

  var config = {
      apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
      authDomain: "fuegocms.firebaseapp.com",
      databaseURL: "https://fuegocms.firebaseio.com",
      projectId: "fuegocms",
      storageBucket: "fuegocms.appspot.com",
      messagingSenderId: "283527892810"
    };

firebase.initializeApp(config);
*/

/*==============
ES5 inclusion
==============*/
/*
 // Firebase App is always required and must be first
var firebase = require("firebase/app");

// Add additional services that you want to use
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");

// Comment out (or don't require) services that you don't want to use
// require("firebase/storage");

var config = {
      apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
      authDomain: "fuegocms.firebaseapp.com",
      databaseURL: "https://fuegocms.firebaseio.com",
      projectId: "fuegocms",
      storageBucket: "fuegocms.appspot.com",
      messagingSenderId: "283527892810"
    };
firebase.initializeApp(config);
*/

/*============
Components
=============*/


//Content-addition-to-database components
import CMSContainerTextPost from './components/CMSContainerTextPost';
import CMSContainerImageUpload from './components/CMSContainerImageUpload';

//database-to-sidebar addition components
import TextAddContainer from './components/TextAddContainer';
import ImageAddContainer from './components/ImageAddContainer';

//Style-addition-to-database components
import StyleContentList from './components/StyleContentList';

//live-edit iFrame population components
import VisualEditor from './components/VisualEditor';

/*============
Firebase initialization
============*/

//const firebase = importFirebase;

//import {firebase_setup} from './db_init';
const db = firebase.database();
const dbTextRef = db.ref('blogs/');
const storageRef = firebase.storage().ref();
const databaseImageRef = db.ref('image_data/');
const dbPageRef = firebase.database().ref('pages/');


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
     let dropdown_selected = document.getElementById('#page_selector').value;
    } catch(error){
      //get the first value that we pull from firebase inst
      try{
        let dropdown_first = document.getElementById('#loading_page').value; 
        this.setState({
          CurrentEditPageHandle : dropdown_first
        })
        }
        catch(error){
          return "loading first value...";
        }
      }

      }

      else if (e){
        let dropdown_selected = e.target.value;
         let DropdownSelection = e.target.value;
        this.setState({
      CurrentEditPage : "src/"+DropdownSelection+".html",
      CurrentEditPageHandle : DropdownSelection
    });
      }
  }

/*
    let dropdown_first = document.getElementById('#page_selector').value;


    this.setState({
      CurrentEditPage : "src/"+dropdown_first+".html",
      CurrentEditPageHandle : dropdown_first
    })
  }
   
}
*/

setFirstPage(input){
  let fetchVar = input;
  if(fetchVar){
    this.setState({
      CurrentEditPage : "src/"+fetchVar[0]+".html",
      CurrentEditPageHandle : fetchVar[0]
    })
  }
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

   // this.setPage();


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

