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
import AddElementsToPage from './components/SIDEBAR_Add_To_Page/AddElementsToPage';
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
    this.updateCurrentEditPageHandle = this.updateCurrentEditPageHandle.bind(this);
    this.setSelectedElement = this.setSelectedElement.bind(this);
    this.pageVsSection = this.pageVsSection.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.reIndex = this.reIndex.bind(this);
    this.getGhosted = this.getGhosted.bind(this);


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
    selectedElement : null,
    sidebar_shown: "sb_shown",
    ghosted: false
    }



setPage(e){

  this.getGhosted(false);

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


setSelectedElement(event){

  var element_selected = event.target;

  var flag = event.target.style == "border-style : dotted" ? "border-style : none" : "border-style : dotted";

  //event.target.setAttribute("class", "highlighted");

  //event.target.setAttribute("style", "border-style: dotted");

  var textArrayedFlag = 0;
  var returnCssArray = [];
  var CssTextArrayed = event.target.style.cssText.split(';');
  for (let i = 0; i < CssTextArrayed.length; i++){
    if (CssTextArrayed[i] === " border-style: dotted"){
      CssTextArrayed[i] = "border-style: none;";
      textArrayedFlag = 1;
    }
  }



  if(textArrayedFlag === 1){
    for(let j = 0; j < CssTextArrayed.length; j++){
      returnCssArray.push(CssTextArrayed[j]);
    }
    event.target.style.cssText = returnCssArray.toString();
  }


  if(textArrayedFlag === 0){
    event.target.style.cssText +="border-style: dotted; border-color: red;";
  }
  

  this.setState({selectedElement : element_selected});


  var DraggedElement = null;


  element_selected.addEventListener("drag", setDraggedElement);
  element_selected.addEventListener("dragover", dragover);
  element_selected.addEventListener("dragenter", dragenter);
  element_selected.addEventListener("drop", (e) => this.reIndex(e));


  function setDraggedElement(e){
    console.log("dragged element is:"+e);
    DraggedElement = e.srcElement;
  }

  function dragover(e) {
    e.preventDefault()
    console.log("dragover elemement is:"+e);
  }
  function dragenter(e) {
    e.preventDefault()
    console.log("entered elemement is:"+e);
  }
  function drop(e, DraggedElement) {
    this.append(element_selected);
    this.reIndex(e, DraggedElement);
    console.log("drop attempt on element:"+e);
  }

  

}

  /*=================
  Function that will re-index the elements within the frame when 
  a user changes its position within the live editor
  =================*/

  reIndex(e, DraggedElement){
    e.preventDefault();
    
    //var movedElement = e.target;
    var movedElement = DraggedElement;
    var priorElement = e.target.previousSibling;
    var nextElement = e.target.nextSibling;
    var priorElementUid = priorElement.getAttribute("dbid");
    var nextElementUid = nextElement.getAttribute("dbid");
    var thisElementUid = movedElement.getAttribute("dbid");
    var dbRef = firebase.database().ref("pages/"+this.props.PageHandle+"/tags/").once('value', (snap)=> {return snap.val()});
    var priorPlacement =  dbRef.child(priorElementUid).val().placement;
    var nextPlacement =  dbRef.child(nextElementUid).val().placement;
    var nextFlag = "sibling";
    var priorFlag = "sibling";


    priorElement.append(movedElement);

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
              for(let i = 1; i < thisPlacementArray.length; i++){
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


      dbRef.child(thisElementUid).update({
        attributes : thisIndexString
      });

      //loop through reference to verify this index doesn't clash with any other 
      //placement indices.  If it  else if (priorFlag === "child"){

  }


updateCurrentEditPageHandle(toUpdate){
    //

    this.setState({
      CurrentEditPageHandle : toUpdate
    });


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

  pageVsSection(){
    if(this.state.selectedElement != null){
      return("Section :"+this.state.selectedElement)
    }else if (this.state.selectedElement == null){
      return("Page")
    }
  }


  addAttributes(event){

  }


  toggleSidebar(){
    //if the item is closed 
    var sidebar_status = this.state.sidebar_shown === "sb_hidden" ? "sb_shown" : "sb_hidden";
    console.log(sidebar_status);

    this.setState({
      sidebar_shown : sidebar_status
    })
  }


  getGhosted(ghostCall){
    let nowGhost = ghostCall;
    this.setState({
      ghosted: ghostCall
    });
  }

/*
  <div className = "Grand_HTML_list">
  <GrandHTMLList PagesSnapshot = {this.state.PagesSnapshot} CurrentEditPageHandle = {this.state.CurrentEditPageHandle} />
  </div>
*/

 
    render(){
  return(
    <span className = "app-container" id = {this.state.sidebar_shown}>

      <div className="sidebar" >

        <div className = "upload_content">
          <h1>Upload Content </h1> 
            <CMSContainerTextPost />
            <CMSContainerImageUpload /> 
          </div>

          <div className = "add_content">
            <h1>Add to {this.pageVsSection()}</h1>
            <h2 className="page-add-subheader">Content</h2>
            <TextAddContainer CurrentEditPageHandle = {this.state.CurrentEditPageHandle} TextArray = {this.state.TextList} />
            <SidebarImageContainer CurrentEditPageHandle = {this.state.CurrentEditPageHandle} ImageArray = {this.state.ImageList} />

            <h2 className="page-add-subheader">Page Elements</h2>
            <AddElementsToPage SelectedElement = {this.state.selectedElement} CurrentEditPageHandle = {this.state.CurrentEditPageHandle} />

            <h2 className="page-add-subheader">Preset Elements</h2>
            <AddPreset CurrentEditPageHandle = {this.state.CurrentEditPageHandle} ImageArray = {this.state.ImageList} />
          </div>

          <div className = "style_content">
            <h1>Style Page Content</h1>
            <StyleContentList SelectedElement = {this.state.selectedElement} CurrentEditPageHandle = {this.state.CurrentEditPageHandle} />
          </div>





          </div>

      <div className = "VisualSection">
        <button className = "collapse" onClick = {this.toggleSidebar}>TOGGLE SIDEBAR</button>
        <VisualEditor getGhosted = {this.getGhosted} ghosted = {this.state.ghosted} setSelectedElement = {this.setSelectedElement} reIndex = {this.reIndex} currentPage = {this.state.CurrentEditPage} pageHandle = {this.state.CurrentEditPageHandle} updateCurrentEditPageHandle = {this.updateCurrentEditPageHandle} SetPage = {this.setPage} />
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

