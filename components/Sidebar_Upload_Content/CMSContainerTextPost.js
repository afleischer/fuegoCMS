import React, { Component } from 'react';

import firebase from '../../firebase.js';

import { connect } from 'react-redux';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



function NoticeBoxText(props){
  return <div className = {props.class_name}><h2 className = "noticeText">Text Copy Uploaded!</h2></div>;
}

class CMSContainerTextPost extends React.Component{
    constructor(props){
      super(props);
      this.updateBlogTextState = this.updateBlogTextState.bind(this);
      this.sendBlogTextToDB = this.sendBlogTextToDB.bind(this);
      this.handleChange = this.handleChange.bind(this)
    }
    state = {
  blogText : "Add Text Here",
  noticeVisible : "hiddenBoxImg",
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
      

  }

   handleChange(value) {
    this.setState({ blogText: value })
  }


    render(){

  return(   
    <div className = "container"> 
      <h2 className = "page-add-subheader">ADD TEXT</h2>
      <h4>Text added and submitted here will be uploaded to the database for reuse in your page in the "Add to Page" section.</h4>
      <ReactQuill value={this.state.blogText} onChange={this.handleChange} />
      <h4>HTML Preview:</h4>
      <textarea id = "blog-copy" rows = "4" cols = "50" type = "longtext" placeholder = "Enter Text Here" readOnly=true value = {this.state.blogText} />
      <br />
      <button type = "button" onClick = {this.sendBlogTextToDB} id = "submission">SUBMIT</button>
      <NoticeBoxText class_name = {this.state.noticeVisible} />
    </div>
  );
    }
    
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CMSContainerTextPost); 