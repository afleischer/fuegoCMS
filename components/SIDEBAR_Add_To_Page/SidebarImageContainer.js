import React, { Component } from 'react';

import firebase from '../../firebase.js';

import getTopPlacement from '../functions/getTopPlacement'


const ImageItem = (props) => {


    var returnArray = [];
    var Metadata = props.Metadata;
    
    try{
      for(let i = 0; i < Metadata.length; i++){

        var imageName = Metadata[i].image_name;
        var imageUrl = Metadata[i].image_url;

        returnArray.push(<div onClick = {(e) => props.addTagToFrame(e, "img", "display: block", imageName)}  className = "thumbnail_div" key = {i} ><p className = "thumbnail_name" >{imageName}</p><img className = "thumbnail" src ={imageUrl} name = {imageName} /></div>);
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

  addTagToFrame(event, tag, style, name){

    //Get a reference to the page being edited
    var pageURL =  this.props.CurrentEditPageHandle;
    var image_sidebar_url = event.currentTarget.lastElementChild.getAttribute('src');

    //var image_name = event.currentTarget.lastElementChild.getAttribute('name');

    var image_name = event.currentTarget.lastElementChild.getAttribute('name');

    var image_ref_metadata = this.state.image_metadata;


    /*=================
    Compare the "contnt" var, which has the image's src attribute and name, 
    with the image name in the photos database.
      We can then compare the names to get the url of the photo in the image database
      so we can push it to the ghost element
    ==================*/

    var image_frame_url;

    for(let i = 0; i <= image_ref_metadata.length-1; i++){
      if(image_ref_metadata[i].image_name == image_name){
        image_frame_url = image_ref_metadata[i].image_url;
      }

    }


    try{
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    }

    catch(error){
      return "Select Page";
    }

    var tagCounter = getTopPlacement(pageURL);
    tagCounter++;



    /*============
    No need to call push then set; giving parameters to push allows for a simultaneous push+set operation now
    =============*/

    firebase.database().ref('pages/'+pageURL+'/tags/').push({
        tag_type : tag,
        content : image_frame_url,
        placement : tagCounter,
        style : style 
    });

 //   firebase.database().ref('pages/'+pageURL+'/tags/'+key).set({update});

   // firebase.database().ref('pages/'+pageURL+'/tags/'+key).push().set({update});


  }

  //or I could send this to firebase storage...  


    //TO ADD BELOW ONCE THE TEXTITEM IS CONFIRMED WORKING: 
    // onClick = {this.addTagToFrame(event, 'img', null)}
  render(){
    return(
      <div className = "image_add_container">
        <h2>Add Stored Images to Page</h2>
        <ImageItem addTagToFrame = {this.addTagToFrame} currentPage = {this.props.CurrentEditPageHandle}  Metadata = {this.state.image_metadata} />
      </div>
      );
  }

}