import React, { Component } from 'react';


var firebase = require("../firebase/app");


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