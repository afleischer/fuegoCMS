import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import base from 're-base';
import Style from 'style-it';
import Iframe from 'react-iframe';

import firebase from './firebase.js';


/*============
Components
=============*/


//Upload content
import CMSContainerTextPost from './components/SIDEBAR_Upload_Content/CMSContainerTextPost';
import CMSContainerImageUpload from './components/SIDEBAR_Upload_Content/CMSContainerImageUpload';

//Add content to Page
import TextAddContainer from './components/SIDEBAR_Add_To_Page/TextAddContainer';
import SidebarImageContainer from './components/SIDEBAR_Add_To_Page/SidebarImageContainer';
import AddPreset from './components/SIDEBAR_Add_To_Page/AddPreset';

//Change content Attributes
import StyleContentList from './components/SIDEBAR_Change_Attributes/StyleContentList';

//live-edit iFrame population components
import VisualEditor from './components/SIDEBAR_Add_To_Page/VisualEditor';

//EXPERIMENTAL: See if I can get the grand HTML list
import GrandHTMLList from './components/temporary/GrandHTMLList';

/*============
Firebase initialization
============*/


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


    firebase.database().ref('pages/').on('value', snapshot =>{
      this.setState({
        PagesSnapshot : snapshot
      });
    });
  }



    state = {
    TextList : null,
    ImageList : null,
    CurrentEditPage : null,
    PagesSnapshot : null,
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
    
    var update = [];

    var counter = 1;


  }
 
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
            <SidebarImageContainer CurrentEditPageHandle = {this.state.CurrentEditPageHandle} ImageArray = {this.state.ImageList} />
            <AddPreset CurrentEditPageHandle = {this.state.CurrentEditPageHandle} ImageArray = {this.state.ImageList} />
          </div>

          <div className = "style_content">
            <h1>Style Page Content</h1>
            <StyleContentList CurrentEditPageHandle = {this.state.CurrentEditPageHandle} />
          </div>

          <div className = "Grand_HTML_list">
          <GrandHTMLList PagesSnapshot = {this.state.PagesSnapshot} CurrentEditPageHandle = {this.state.CurrentEditPageHandle} />
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

