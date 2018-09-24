import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Iframe from 'react-iframe';

import GhostElement from './VisualEditorChildren/GhostElement.js';

import firebase from '../../firebase.js';



const DropdownOptions = (props) => {

  var pages = props.Pages;
  var returnArray = [];
  //returnArray.push(<select id="page_selector">);

  if(pages!= 0){
    returnArray.push(<option key = '0' value= "Choose">Select Page to Edit</option>);
      for(let i = 0; i <= pages.length -1; i++){
    returnArray.push(<option key={i} value={pages[i]}>{pages[i]}</option>);
   } 
  }else {
    returnArray.push(<option id="loading_page" key="shhhh" value = "Loading">Loading</option>);
  }

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
    this.setHTML = this.setHTML.bind(this);
    this.clearPriorHTML = this.clearPriorHTML.bind(this);
    this.indexHTML = this.indexHTML.bind(this);

    //set refs
    this.ghostRef = React.createRef();
    this.iFrameRef = React.createRef();


  //Set Database listeners
  firebase.database().ref('pages/').on('value', snapshot => {
    this.clearPriorHTML();
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
    try{
      let ghostRefTags = ReactDOM.findDOMNode(ghostRef);

     if(ghostRefTags.innerText != "Loading Content...") {
      let outerElements = ghostRefTags.outerHTML;

      let editorFrame = document.getElementById('VisualEditorWindow');

      editorFrame.contentDocument.write(outerElements);
    //frameDoc.documentElement.innerHTML = outerElements;
     }
     else{
      return false;
     }


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


  clearPriorHTML(){
    var ghostRef = this.ghostRef;
    var frame = document.getElementById('VisualEditorWindow');
    var frameDoc = frame.contentDocument || frame.contentWindow.document;


    frameDoc.documentElement.querySelectorAll(".ghost").forEach ( e => e.parentNode.removeChild(e));
    
    //frameDoc.removeChild(frameDoc.documentElement.querySelectorAll(".ghost"));
    //frameDoc.documentElement.innerHTML = "";


  }





  indexHTML(){

    var pageURL = this.props.currentPage;

    function executeIndex(data, pageName){
      let parser = new DOMParser();
      const rootNode = parser.parseFromString(data, "text/html");
      indexHTMLRecurse(rootNode, 0, null);
      logIndex(indexArray, pageName);
      return indexArray;
    }


    function readFile(executeIndex){
      const file = document.getElementById('HTML upload').files[0];

      const reader = new FileReader();

      var fileData = null;
      var start = null;
      var pageName = file.name;

      //for any file given, if there is a period present, 
      //slice off the end and return it 
      var parsedPageName = pageName.split('.')[0];
  
      reader.onload = function() {
        executeIndex(reader.result, parsedPageName);
    } 
      reader.readAsText(file);
    }



    const indexArray = [];

    readFile(executeIndex);



    /* GhostElement should automatically update... */

    function indexHTMLRecurse(start, depth, priorIndex){
        var prior;

        class Update {
          constructor(name, attributes, content, placement){
            this.TagName = name;
            this.TagAttributes = attributes;
            this.TagContent = content;
            this.Placement = placement;
          }

        }
        for(let i = 0; i < start.childNodes.length; i++){
            let prior = (priorIndex === null) ? i : priorIndex;
            let thisNode = start.childNodes[i];

            if(depth > 0){
              var indexValue = prior+'.'+i;
            } else if (depth === 0){
              var indexValue = '';
            }

            /*=================
            Get the values!
            ==================*/

            let TagName = thisNode.tagName;
            let TagAttributes = thisNode.attributes;
            let TagContent = thisNode.textContent;
            var Placement;
            if(depth > 0){
            var Placement = indexValue;
            }else if (depth === 0){
            var Placement = 0; 
            }     

            let thisUpdate = new Update(TagName, TagAttributes, TagContent, Placement);

            indexArray.push(thisUpdate);

            if(thisNode.hasChildNodes){
              let nextDepth = depth++;
              let nextIndex = indexValue;
              indexHTMLRecurse(thisNode, nextDepth, nextIndex);
            }
        }

    }


      function logIndex(indexArray, pageURL){
        for(let i = 0; i < indexArray.length; i++){
          firebase.database().ref('pages/'+pageURL+'/tags/').push({
            tag_type : indexArray.TagName,
            tag_placement : indexArray.Placement,
            tag_content : indexArray.TagContent,
            tag_attributes : indexArray.TagAttributes
          });
        }
      }


      //We will need a separate function to take the values in indexArray and log them to Firebase
      
      //return indexArray;
  } 



  componentDidMount(){
    this.props.SetPage();
  }

  render(){
    return(
      <div>
        <select id = "page_selector" onLoad = {() => {this.props.SetPage() /*this.setHTML()*/}} onChange = {(e) => {this.clearPriorHTML(), this.props.SetPage(e) /* this.setHTML() */}}> 
          <DropdownOptions Pages = {this.fetchPagesToEdit()} />
        </select>
        Add Page: <input type = "text" id = "page_addition" name = "Add Page" refs = "add_page_element"></input>
        <input type = "submit" value = "submit" onClick = {this.addPage}></input>

        <label name = "HTML upload">Upload Webpage</label>
        <input type = "file" id = "HTML upload" onChange = {this.indexHTML} />

        <h1>Visual editing section</h1>
        <Iframe
          id = "VisualEditorWindow"
          url = {this.props.CurrentEditPageHandle}
          ref = {this.iFrameRef}
          width = "calc(100vw - 500px)"
          height = "90vh"
          className = "iframe"
          display="initial" 
          onLoad = {this.setHTML}
          frameBorder = "10"
          />
          <GhostElement setHTML = {this.setHTML} ref={this.ghostRef} PageEditing = {this.props.CurrentEditPageHandle} Snapshot = {this.state.PagesSnapshot} style= "display:none;"/>
      </div>

      );
  }
}
