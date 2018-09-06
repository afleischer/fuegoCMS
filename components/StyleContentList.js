import React, { Component } from 'react';

import StyleTextCopyList from './sidebar_list_children/StyleTextCopyList';
import ImageStyleList from './sidebar_list_children/ImageStyleList';

var firebase = require("firebase/app");

export class StyleContentList extends React.Component{
  constructor(props){
    super(props);

    //Database listeners
    
      firebase.database().ref('pages/').on('value', snapshot => {
        this.setState({
          PageSnapshot : snapshot
          });
      });

        db.ref('image_data').on('value', snapshot => {
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