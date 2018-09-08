import React, { Component } from 'react';

//import {firebase_setup} from '../db_init';

//var firebase = require("firebase/app");
import '../db_init';


const DropdownOptions = (props) => {

  var pages = props.Pages;
  var returnArray = [];
  //returnArray.push(<select id="page_selector">);

  try{
      for(let i = 0; i <= pages.length -1; i++){
    returnArray.push(<option key={i} value={pages[i]}>{pages[i]}</option>);
   } 
  }catch(error){
    returnArray.push(<option key="shhhh" value = "Loading options...">Loading...</option>);
  }
  //returnArray.push(</select>);
  return returnArray;
}


export default class VisualEditor extends React.Component{
  constructor(props){
    super(props);

    //set functions
    //this.setVisualEditorPage = this.setVisualEditorPage.bind(this);
    this.addTagToFrame = this.addTagToFrame.bind(this);
    this.addPage = this.addPage.bind(this);
    //this.setPage = this.setPage.bind(this);
    this.fetchPagesToEdit = this.fetchPagesToEdit.bind(this);
    this.loadIFrame = this.loadIFrame.bind(this);
    this.setHTML = this.setHTML.bind(this);


    //set refs
    this.ghostRef = React.createRef();
    this.iFrameRef = React.createRef();


  //Set Database listeners
  firebase.database().ref('pages/').on('value', snapshot => {
    console.log("this is a breakpiont");
      this.setState({
        PagesSnapshot : snapshot
        });
    });
  }

//Set state
  state = {
    pagesToEdit : null,
    VisualSnapshot : null,
  }

/******************
Begin functions
******************/

//Populate the iFrame with the content.  

//Notice!  This logic has been duplicated into "ghostElement" and will be referenced
//instead in the function setHTML
  loadIFrame(){

 
    const snapshot = this.state.PagesSnapshot;

    if(snapshot){
    const currPage = document.querySelector('#page_selector').value;
    if (currPage != ""){


    var pageTags = [];

/////////////

      var page_tag_pull = Object.keys(snapshot.val());

      var current_page_node = snapshot.child(currPage);

      current_page_node.forEach(function (tagSnapshot){
        let tags_value = tagSnapshot.val();

        let tag_type = tags_value.tag_type;
        let tag_content = tags_value.content;
        let tag_placement = tags_value.placement;
        let tag_style = tags_value.style;

        if (tag_type == 'p'){
          pageTags.push(<p styles = {tag_style}>{tag_content}</p>);
        }else if (tag_type == 'h1'){
          pageTags.push(<h1 styles = {tag_style}>{tag_content}</h1>);
        }
        /*
        else if(TagType == 'img'){
            pageTags.push(<img src = {imageSrc}></img>);
          }
        */ 
       });

        return pageTags;

      }
/////////////
    return "loading..."

      }
/*
    
    snapshot.forEach(function (childSnapshot){
      let testValue = childSnapshot.val();

      if(currPage == Object.keys(testValue.pages)[0]){

        const currPage = document.querySelector('#page_selector').value;

        console.log('break');

        var TagType = `{testValue.pages.currPage.tags[0].tag_type}`;

        var tagType_pt1 = testValue.pages
        var tagType_pt2 = tagType_pt1[currPage];
        var tagType = tagType_pt2.tags[0].tag_type;

        var tagStyle_pt1 = testValue.pages
        var tagStyle_pt2 = tagStyle_pt1[currPage];
        var tagStyle = tagStyle_pt2.tags[0].style;

        var tagContent_pt1 = testValue.pages;
        var tagContent_pt2 = tagContent_pt1[currPage];
        var tagContent = tagContent_pt2.tags[0].content;
        
          //if (childSnapshot.child('tags')){
          //pageTags.push(<TagType style = {tagStyle}>{tagContent}</TagType>);
          //React.createElement(TagType, {style : tagStyle}, tagContent);
      //}    

    //let editorFrame = document.getElementById('VisualEditorWindow')
    //editorFrame.contentDocument.write(pageTags);

          if(tagType == 'p'){
            pageTags.push(<p style = {tagStyle}>{tagContent}</p>);
          }else if(TagType == 'img'){
            pageTags.push(<img src = {imageSrc}></img>);
          }
        }
        */
    }
   
   /*  
    let editorFrame = document.getElementById('VisualEditorWindow');
    let editorFrameDoc = editorFrame.contentDocument;
    //editorFrameDoc.write(pageTags)

    //editorFrame.postMessage(pageTags, 'http://localhost:8080/', false);

    //editorFrame.contentDocument.write(JSON.stringify(pageTags));
    editorFrame.contentDocument.write(pageTags);
    */


    /***********
    get the outerHTML content of the ghostRef 
    ***********/



  addPage(pageName){
    //get the value of the newPage name
    try{
      var newPage = document.querySelector("#page_addition").value;
    }
    catch(error){
      return false;
    }

    //Add the name of the new page to the database
    const webPrefix = "localhost:8080/src/";
    const webSuffix = ".html"
    var PageToAdd = webPrefix + newPage + webSuffix;
    var dateVar = new Date();
    const pagePathVar = "/"+newPage;

    var snapshot = this.state.PagesSnapshot;

    var pageRef = firebase.database().ref('pages/');


    
    if ((newPage != "") && (newPage != undefined) && (newPage != null)){
    pageRef.set({
      tags :  [
            {
          tag_type : "h1",
          content : "This is a new page!",
          placement : 1,
          style : "font-family: helvetica;"
        }
          ]
      
      });

    }


  }

  fetchPagesToEdit(){
    var returnArray = [];
    var snapshot = this.state.PagesSnapshot;

    if(snapshot){
      let snaplength = Object.keys(snapshot.val()).length;
      let page_name = Object.keys(snapshot.val());
        for(let i = 0; i < snaplength; i++){
          returnArray.push(page_name[i]);
        }
    };
    
    return returnArray;
  }


  setHTML(){
    let ghostRef = this.ghostRef.current;
    let iFrameRef = this.loadIFrame.current;
try{
      let ghostRefTags = ReactDOM.findDOMNode(ghostRef);
      let outerElements = ghostRefTags.outerHTML;

      let editorFrame = document.getElementById('VisualEditorWindow');

    editorFrame.contentDocument.write(outerElements);
    }catch(error){
      console.log("setHTML is loading...");
      return false;


      //TODO: Page Swapping, First page Loading notice


    }

  }


//https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
    //https://firebase.google.com/docs/database/web/read-and-write <- see "updating"
  addTagToFrame(event, tag, style, CurrentEditPageHandle){

    //Get a reference to the page being edited
    var pageURL =  this.state.CurrentEditPage;  
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    var snapshot = this.state.PagesSnapshot;
     
    var allTag = "tag_type";

    //To the end, add a tag

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
          placement : tagCounter,
          style : style
        }
          ]
    }

//can also try: https://firebase.google.com/docs/database/web/lists-of-data
    var updates = {};
      updates['/pages/' + newTagKey] = tagData;

    pageRef.update(updates);

  }

//Will be hoisted to parent and passed down 

/* 
  setPage(e){
    //change "PageEdited" to 
    let DropdownSelection = e.target.value;
    this.setState({
      CurrentEditPage : "src/"+DropdownSelection+".html"
    });
  }

  */ 

  componentDidMount(){
    this.loadIFrame();
  }

  render(){
    return(
      <div>
        <select id = "page_selector" onChange = {(e) => {this.props.SetPage(e), this.loadIFrame(), this.setHTML()}}> 
          <DropdownOptions Pages = {this.fetchPagesToEdit()} />
        </select>
        Add Page: <input type = "text" id = "page_addition" name = "Add Page" refs = "add_page_element"></input>
        <input type = "submit" value = "submit" onClick = {this.addPage}></input>
        <Iframe
          id = "VisualEditorWindow"
          url = {this.props.CurrentEditPageHandle}
          ref = {this.iFrameRef}
          width = "calc(100vw - 500px)"
          height = "90vh"
          className = "iframe"
          display="initial" 
          onLoad = {this.setHTML}
          />
          <GhostElement ref={this.ghostRef} PageEditing = {this.props.CurrentEditPageHandle} Snapshot = {this.state.PagesSnapshot} style= "display:none;"/>
      </div>

      );
  }
}
