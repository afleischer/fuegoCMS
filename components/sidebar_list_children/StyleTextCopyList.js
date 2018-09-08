import React, { Component } from 'react';

import Style from 'style-it';

import firebase from '../../firebase.js';

//import {firebase_setup} from '../../db_init';


//var firebase = require("firebase/app");

/*
 try {
    let firApp = firebase.app(applicationName);
    return firApp;
  } catch (error) {
    return firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: firebaseUrl
    }, applicationName);
  }
*/ 

export const StyleTextCopyList = (props) => {

  //order by child "placement", filter by page id 

  try{
    var currentPage = props.currentPage;
    var snapshot = props.snapshot;

    if( currentPage && snapshot){
      //NOTICE: If it fails here, try it when calling the snapshot 
      

      //var filteredSnap = snapshot.orderByChild('placement').equalTo(currentPage);
      
      //Feature: list the tags on the page, 

      var paragraphArray = [];
      var p_styles
      var h1Array = [];
      var h2Array = [];
      var h3Array = [];

      var returnArray = [];

      let key = 0;

      snapshot.forEach(function (childSnapshot){
        let value = childSnapshot.val();
        let styled = Style.it(`{value.tags.style}`);
        //if the child is of the type "p"
        if(childSnapshot.child('p')){
          paragraphArray.push(value.tags.content);

          paragraphArray.push(<p key = {key}>{value.tags.content}</p>);
          key++;
        }else if(childSnapshot.child('h1')){
          //h1Array.push(value);
          h1Array.push(<h1 key = {key}>{value.tags.content}</h1>);

        }else if(childSnapshot.child('h2')){
          //h2Array.push(value);
          h2Array.push(<h2 key = {key}>{value.tags.content}</h2>);

        }else if(childSnapshot.child('h3')){
          //h3Array.push(value);
          h3Array.push(<h3 key = {key}>{value.tags.content}</h3>);
        }

      });

      
      //returnArray = [(<div className = "style_list">{paragraphArray}</div>), (<div className="style_list">{h1Array}</div>), (<div className = "style_list">{h2Array}</div>),(<div>{h3Array}</div>)];
      returnArray = [(<div><h2 className = "style_subheader">Text Elements ("P" tag)</h2><div className = "style_list">{paragraphArray}</div> </div>), (<div><h2 className = "style_subheader">Large Headers ("h1" tag)</h2><div className="style_list">{h1Array}</div> </div>), (<div><h2 className = "style_subheader">Medium Headers ("h2" tag)</h2><div className = "style_list">{h2Array}</div></div>),(<div><h2 className = "style_subheader">Small Headers ("h3" tag)</h2><div>{h3Array}</div></div>)];
      //let returnArrayFinal = (<div>{returnArray}</div>)

      return returnArray;

    }else{
      return (<div>Loading...</div>);
    }


  }catch(error){
    return (<div>Loading...</div>);
  }

}