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







//This space blank for emphasis 








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

    /*===============
    Code block that will expose the iFrame elements for modification
    ===============*/


        try{
          var test = document.getElementById("VisualEditorWindow").contentDocument.querySelectorAll('.frame-tag');
          if(!test[0]){return false};
          var nodelist = document.querySelector('.iframe').contentDocument.querySelectorAll('.frame-tag');

          for(let i = 0; i < nodelist.length; i++){
            nodelist[i].addEventListener('click', this.props.setSelectedElement);
          }
        }catch(error){
          //pass
        }



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
    
    if(frame === null){
      return false;
    }

    var frameDoc = frame.contentDocument || frame.contentWindow.document;
    
    frameDoc.documentElement.querySelectorAll(".ghost").forEach ( e => e.parentNode.removeChild(e));

  }





  indexHTML(){

    var updateCurrentEditPageHandle = this.props.updateCurrentEditPageHandle;
    var pageURL = this.props.currentPage;

    function executeIndex(data, pageName, updateCurrentEditPageHandle){

      var updateCurrentEditPageHandle = updateCurrentEditPageHandle
      let parser = new DOMParser();
      const rootNode = parser.parseFromString(data, "text/html");
      indexHTMLRecurse(rootNode, 0, null);
      logIndex(indexArray, pageName, updateCurrentEditPageHandle);
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
        executeIndex(reader.result, parsedPageName, updateCurrentEditPageHandle);
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

            if(thisNode.nodeType != 1){
              //only grab element nodes! 
              return false;
            }

            if(depth > 0){
              var indexValue = prior+'.'+i;
            } else if (depth === 0){
              var indexValue = '';
            }

            /*=================
            Get the values!
            ==================*/

            function getPlacement(thisNode){
              return [].reduce.call(thisNode.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
            }

            let TagName = thisNode.tagName;
            let TagAttributes = thisNode.attributes;
            //let TagContent = thisNode.textContent;
            let TagContent = getPlacement(thisNode);
            var Placement;
            if(depth > 0){
            var Placement = indexValue;
            }else if (depth === 0){
            var Placement = 0; 
            }     

            let thisUpdate = new Update(TagName, TagAttributes, TagContent, Placement);

            indexArray.push(thisUpdate);

            if(thisNode.hasChildNodes){
              let nextDepth = depth+1;
              let nextIndex = indexValue;
              indexHTMLRecurse(thisNode, nextDepth, nextIndex);
            }
        }

    }


      function logIndex(indexArray, pageURL, updateCurrentEditPageHandle){

        updateCurrentEditPageHandle(pageURL);

        for(let i = 0; i < indexArray.length; i++){
          firebase.database().ref('pages/'+pageURL+'/tags/').push({
            tag_type : indexArray[i].TagName,
            placement : indexArray[i].Placement,
            content : indexArray[i].TagContent,
            tag_attributes : indexArray[i].TagAttributes
          });
        }
      }


      //We will need a separate function to take the values in indexArray and log them to Firebase
      
      //return indexArray;
  } 


  highlightSetup(){

  }


  /*=================
  Function that will re-index the elements within the frame when 
  a user changes its position within the live editor
  =================*/

  reIndex(e){
    
    var movedElement = e.target;
    var priorElement = e.target.previousSibling;
    var nextElement = e.target.nextSibling;
    var priorElementUid = priorElement.getAttribute("dbid");
    var nextElementUid = nextElement.getAttribute("dbid");
    var thisElementUid = movedElement.getAttribute("dbid");
    var dbRef = firebase.database().ref("pages/"+this.props.PageHandle+"/tags/");
    var priorPlacement =  dbRef.child(priorElementUid).val().placement;
    var nextPlacement =  dbRef.child(nextElementUid).val().placement;
    var nextFlag = "sibling";
    var priorFlag = "sibling";

    var uniqueIDs = Object.keys(dbRef.val());
      //Want: [{uID : placement, uID : placement, ...}]

    var AttrsWithKeys = [];  

    var indexReferences = dbRef.once('value', snapshot => {
      for(let k = 0; k < uniqueIDs; k++){
        let placment_update = snapshot.child(uniqueIDs[k]).val().placement;
        let update = {
          placement :  placment_update,
          uID : uniqueIDs[k]
        }
        AttrsWithKeys.push(update);
      }

    })


    if(movedElement.hasChildNodes){
      nextElement = movedElement.children;
      nextFlag = "child";
    } 

    //////
    // 
    //////
    if(nextFlag == "sibling" && priorFlag == "sibling"){
      //if prior is 1.2 and we are a top-level sibling 
      //let's assume that the drag and drop api will put places appropriately

      var priorString = priorPlacement.split('.');  //ex: [1, 1, 1] assuming prior placement is '1.1.1'
      var priorLastDigit = priorString[priorString.length-1]; 
      var priorFirst = priorString[0]; //ex: []

      var nextString = nextPlacement.split('.'); 
      var nextLastDigit = nextString[priorString.length-1];
      var nextFirst = nextString[0];


      //thisIndex will be the new index that we will assign to the dragged element. 
      var thisIndex = [priorFirst]; //since the index won't begin with a ".", assign this as the first
      var thisIndexString;  //This will be the value we'll populate later. 
      var thisDigit = priorLastDigit + 1;  //

      if(priorString.length = 0){  //ex: 1, 2 <- thisIndexString, 
        thisIndexString = priorString + 1;
      }

      if(priorString[1] != undefined){
        for(let i = 1; i < priorString.length; i++){
          thisIndex.push("."+priorString[i]);
        }  
      }

      ///////
      //  thisIndexString will be in the form:
      //   ex)  1.1.1  <- a string of numbers 
      ///////

      for(let j = 0; j < thisIndex.length; j++){
        thisIndexString.concat(thisIndex[j]);
      }

        /*===============
        Ensure that thisIndex doesn't overlap with an already existing index
        ===============*/

        var AWKToUpdate = []
        var nextOrPrior;

        for(let l = 0; l < AttrsWithKeys; l++){
          if(AttrsWithKeys[l] === thisIndexString){  

            var update_digit = AttrsWithKeys.split('.').length-1;
              //This will be the digit that we'll be updating on each element of the array 

            //then we have a conflict, as such: 

                //1.1, 1.2, "prior" -> 1.3, 1.4 <- our element , 1.4 <- next 1.4.1, 1.5, ...
                //1.1, 1.2, "prior" -> 1.3, 1.4 <- our element , 1.5 <- next 1.4.1, 1.5, ...
                  //then need to have: 1.1, 1.2, "prior" -> 1.3, 1.4 <- our element , 1.5 <- next 1.5.1, 1.6, ...
                    //get the digit of the value we'll be updating, then update that for the rest 
            //so we get a slice of the value of next, which 
            //will equal our value we have now. 

            AWKToUpdate = AttrsWithKeys.slice(l);


            //Then we need to update the next so that: 

              //1.1, 1.2, 1.3, 1.4 (ours), 1.5 (next), (the following need to be updated by the "update_digit") 1.5, 1.6
                  //in another case: 
                  //1.1, 1.2, 1.3, 1.4 (ours), 1.5 (next), 1.5.1, 1.6

            let updatedIndices = [];

            AWKToUpdate.forEach(function (arrayItem){
              var thisPlacement = arrayItem.placement;
              var thisPlacementArray = thisPlacement.split('.');
              var thisUpdatedPlacementValue = thisPlacementArray[update_digit] + 1;
              var thisUpdatedPlacement = thisPlacementArray[0].toString; 
              for(let i = 1; i < thisPlacementArray.length, i++){
                i === update_digit ? thisUpdatedPlacement.concat('.'+thisUpdatedPlacementValue) : thisUpdatedPlacement.concat('.'+thisPlacementArray[i]);
              } 
              let entry = {
                uID : arrayItem.uID,
                placement : thisUpdatedPlacement
              }
              updatedIndices.push(entry);
            });

              /*================
              Update the content within the database
              ================*/              

            for(let i = 0; i < updatedIndices.length ; i++){
              dbRef.child(updatedIndices[i].uID).update({
                placement : updatedIndices[i].placement
              });
            }
          }

        }

        //ex: 
        // 1.1 1.2 1.3 1.3 <- (plop) 1.4 1.5

        if(AWKToUpdate != []){
          for(let m = 0; m < AWKToUpdate.length; m++){
            if(AWKToUpdate[m])
          }
        }

      dbRef.child(thisElementUid).update({
        attributes : thisIndexString
      });

      //loop through reference to verify this index doesn't clash with any other 
      //placement indices.  If it does match an index, 

    } else if (next)


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

        <h1>Live Preview</h1>
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
          <GhostElement clearHTML = {this.clearPriorHTML} setSelectedElement = {this.props.setSelectedElement} setHTML = {this.setHTML} ref={this.ghostRef} PageHandle = {this.props.pageHandle} PageEditing = {this.props.currentPage} Snapshot = {this.state.PagesSnapshot} style= "display:none;"/>
      </div>

      );
  }
}
