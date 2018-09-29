import React, { Component } from 'react';


import firebase from '../../firebase.js';

/*
 try {
    let firApp = firebase.app("fuegocms");
    return firApp;
  } catch (error) {
    const config = {
        apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
        authDomain: "fuegocms.firebaseapp.com",
        databaseURL: "https://fuegocms.firebaseio.com",
        projectId: "fuegocms",
        storageBucket: "fuegocms.appspot.com",
        messagingSenderId: "283527892810"
      };
    return firebase.initializeApp(config);
  }

*/

function NoticeBox(props){
  return <div className = {props.class_name}><h2 className = "noticeText">Image Uploaded!</h2></div>;
}


export default class CMSContainerImageUpload extends React.Component{
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
      <h2 className = "page-add-subheader">UPLOAD IMAGE</h2>
      <h4>Images and video added and submitted here will be uploaded to the database for reuse in your page in the "Add to Page" section.</h4>
      <input id = "image_field" type="file" refs="image_form" onInput = {this.setFile} />
      <button type = "button" onClick = {this.handleUploadImage} id = "img_submission">SUBMIT</button>
      <NoticeBox class_name = {this.state.noticeVisible} />
    </div>

    );
  }
}