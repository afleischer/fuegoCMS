import React, { Component } from 'react';

import firebase from '../firebase.js';

/*
 try {
    let firApp = firebase.app("FuegoCMS");
    return firApp;
  } catch (error) {
    return firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: firebaseUrl
    }, applicationName);
  }
  */
//var firebase = require("firebase/app");
//import firebase from 'firebase';
//import {firebase_setup} from '../db_init';

//const db = firebase.database();
//const dbTextRef = db.ref('blogs/');


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


/*====================
Container for adding text to the page
=====================*/

export default class TextAddContainer extends React.Component{
  constructor(props){
    super(props);

    /*============
    Set Firebase listener for text values
    =============*/

  
    firebase.database().ref('blogs/').on('value', snapshot => {
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

    //check this behavior, see if I should use push instead

    pageRef.push(updates);
      //Future me here- use push

    //pageRef.update(updates);

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