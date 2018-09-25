import React, { Component } from 'react';

import {StyleTextCopyList} from './sidebar_list_children/StyleTextCopyList';
import {ImageStyleList} from './sidebar_list_children/ImageStyleList'
import firebase from '../../firebase.js';


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

class StyleContentList extends React.Component{
  constructor(props){
    super(props);
    //Database listeners
    
      firebase.database().ref('pages/').on('value', snapshot => {
        this.setState({
          PageSnapshot : snapshot
          });
      });

        firebase.database().ref('image_data').on('value', snapshot => {
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
  
  componentWillUnmount(){

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

export default StyleContentList;