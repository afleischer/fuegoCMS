import React, { Component } from 'react';

import firebase from '../firebase.js';

import {getTopPlacement} from './functions/getTopPlacement'


const ImageItem = (props) => {


    var returnArray = [];
    var Metadata = props.Metadata;
    
    try{
      for(let i = 0; i < Metadata.length; i++){

        var imageName = Metadata[i].image_name;
        var imageUrl = Metadata[i].image_url;

        returnArray.push(<div onClick = {(e) => props.addTagToFrame(e, "img", "display: block", props.currentPage)}  className = "thumbnail_div" key = {i} ><p className = "thumbnail_name">{imageName}</p><img className = "thumbnail" src ={imageUrl} /></div>);
      }
    }catch(error){
      returnArray.push(<div key="shutupreact">foo</div>);
    }

return returnArray;

}




/*======================
Class containing the image container
=======================*/


export default class SidebarImageContainer extends React.Component{
  constructor(props){
    super(props);


    const databaseImageRef = firebase.database().ref('image_data');
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

  /*===========
  Adds tag to firebase, causing it to be pulled in
  in the VisualEditor -> GhostElement component
  ===========*/

  addTagToFrame(event, tag, style){

    //Get a reference to the page being edited
    var pageURL =  this.props.CurrentEditPageHandle;
    var content = event.currentTarget.lastElementChild.getAttribute('src')

    try{
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    var snapshot = this.state.PagesSnapshot;
    }

    catch(error){
      return "Select Page";
    }

    var tagCounter = getTopPlacement(pageURL);


    var update = {
          tag_type : tag,
          content : content,
          placement : tagCounter,
          style : style
    }




    firebase.database().ref('pages/'+pageURL+'/tags/').push().set({update})


  }

  //or I could send this to firebase storage...  


    //TO ADD BELOW ONCE THE TEXTITEM IS CONFIRMED WORKING: 
    // onClick = {this.addTagToFrame(event, 'img', null)}
  render(){
    return(
      <div className = "image_add_container">
        <ImageItem addTagToFrame = {this.addTagToFrame} currentPage = {this.props.CurrentEditPageHandle}  Metadata = {this.state.image_metadata} />
      </div>
      );
  }

}