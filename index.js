import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import base from 're-base';
import Style from 'style-it';
import Iframe from 'react-iframe';

import firebase from './firebase.js';

import IndexSort from './components/functions/IndexSort'

import 'CSS.escape';

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
    ghosted: false, 
    draggedElement: null
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


  element_selected.addEventListener("drag", (e)=> {this.setState({draggedElement : e.srcElement})});
  element_selected.addEventListener("dragover", dragover);
  element_selected.addEventListener("dragenter", dragenter);
  element_selected.addEventListener("drop", (e) => this.reIndex(e));


  function setDraggedElement(e){
    console.log("dragged element is:"+e);
    this.setState({draggedElement : e.srcElement});
    DraggedElement = e.srcElement;
  }

  function dragover(e) {
    e.preventDefault()
    console.log("dragover elemement is:"+e.srcElement);
  }
  function dragenter(e) {
    e.preventDefault()
    console.log("entered elemement is:"+e);
  }
  function drop(e, DraggedElement) {
    debugger;
    e.srcElement.append(DraggedElement);
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
    var movedElement = this.state.draggedElement;
    var priorElement = e.target.previousSibling;
    var nextElement = e.target.nextSibling;
    var priorElementUid = priorElement.getAttribute("dbid");
    var nextElementUid = nextElement.getAttribute("dbid");
    var thisElementUid = movedElement.getAttribute("dbid");
    //var dbRef = firebase.database().ref("pages/"+this.props.PageHandle+"/tags/").once('value', (snap)=> { });
    var dbRef = this.state.PagesSnapshot.child(this.state.CurrentEditPageHandle).child("tags");
    var priorPlacement =  dbRef.child(priorElementUid).val().placement;
    var nextPlacement =  dbRef.child(nextElementUid).val().placement;
    var nextFlag = "sibling";
    var priorFlag = "sibling";

    var movedElementPlacement = dbRef.child(thisElementUid).val().placement;


    //priorElement.append(movedElement);

    var uniqueIDs = Object.keys(dbRef.val());
      //Want: [{uID : placement, uID : placement, ...}]

    //////
    //We need to array the various placements and keys so that in case there;s 
    //A clash we bump up the following placement variables 
    //////

    var preAttrsWithKeys = [];  
    var placementWithoutKeys = [];


    for(let i = 0; i< uniqueIDs.length; i++){
      var unique_key = uniqueIDs[i];
      var placement = dbRef.child(unique_key).val().placement;
      var update = {unique_key : unique_key, placement : placement};
      preAttrsWithKeys.push(update);
      placementWithoutKeys.push(placement);
    }

    /*============
    sort the AttrsWithKeys array by placement value
    =============*/

    var sortedPlacementWithoutKeys = IndexSort(placementWithoutKeys);

    var AttrsWithKeys = [];


    for(let j = 0; j < sortedPlacementWithoutKeys.length; j++){
      for(let k = 0; k < preAttrsWithKeys.length; k++){
        if(placementWithoutKeys[j] === preAttrsWithKeys[k].placement){
          AttrsWithKeys[j] = {
            unique_key : preAttrsWithKeys[k].unique_key,
            placement : preAttrsWithKeys[k].placement
          } 
        }
      }
    }



    /*============
    AttrsWithKeys is now sorted! Now that it's sorted, we can slice up our arrays so that 
    we can put our updated values in.  


    we can set our element's 
    placement to equal the nextElement
    ============*/


    for(let i = 0; i < AttrsWithKeys.length; i++){
      if(AttrsWithKeys[i].unique_key === thisElementUid){
        AttrsWithKeys[i].placement = nextPlacement;
      }
    }


    /*=============
    We need to re-sort this array now that we've modified the placement value of 
    our dropped item.  Then we need to start our bit-shift operations if 
    there's an overlap. 

    Issue: I'm not sure how the IndexSort will react to 
    =============*/

    //IndexSort(AttrsWithKeys);



    var nextNextElement = getNextNextElement(nextElement);

    var foo = "bar";

    var nextIndexGlobal;



    function updateAttrsWithKeysAndReSort(){
      for(let i = 0; i < AttrsWithKeys.length; i++){
        if (AttrsWithKeys[i].unique_key === thisElementUid){
          AttrsWithKeys[i].placement === nextPlacement;
        }
      }
    }


    /*=============
    If we move around an item to drag and drop it, 
    we will displace the placement of the "nextElement" element. 
    The behavior we take next will depend on the element after, or the 
    "nextNext" element.  We need to find what that is in our sorted AttrsWithKeys array.
    =============*/

    function getNextNextElement(element) {
      //get the index of the next element uID
      for(let i = 0; i < AttrsWithKeys.length; i++){

      try{
        if(AttrsWithKeys[i].unique_key === element.getAttribute("dbid")){
          var nextIndex = i;
          nextIndexGlobal = i;
          break;
        }
      }catch(error){
        return false;
      }
      }

      //let nextIndex = AttrsWithKeys.indexOf(element.getAttribute("dbid"));
      let nextNextIndex = nextIndex + 1;

      if(nextNextIndex >= AttrsWithKeys.length){
        return false;
      }

      let nextNextValues = AttrsWithKeys[nextNextIndex];
      let nextNextuID = nextNextValues.unique_key;

      //we have the nextNextValues.  From these, let's get the element. 

      //The following line won't work on Safari; TODO:  Get a polyfill for this 
      let nextNextElement = document.getElementById("VisualEditorWindow").contentDocument.querySelector('[dbid='+CSS.escape(nextNextuID)+']')

      //return AttrsWithKeys[nextNextIndex];

      return nextNextElement;
    }




    /*============
    The following function, given a string index (ex: '1.2.2'), will
    shift the last digit of the index forward 1.  
    =============*/


    function digitShift(indexStr){
      if(indexStr.toString().length == 1){
        return indexStr + 1;
      }
      let toShift = indexStr;
      let indexArr = indexStr.split('.');
      let lastIndex = indexArr[indexArr.length-1];
      lastIndex++;
      let shifted;
      for (let i = 0; i < indexval.split('.').length; i++){
        if(i = 0){
          shifted.push(indexArr[0]);
        }else if (i > 0){
          shifted.push('.'+indexArr[i]);
        }
      }
      return shifted;
    }


    /*============
    Prepare the nextPlacement variable for comparison in the 
    following function.

    "shiftedNext" is what we will update the placement of the "nextPlacement" to.
    ============*/

    if(nextPlacement.toString().length > 1){
      var shiftedNext = digitShift(nextPlacement);
    } else {
      var shiftedNext = nextPlacement + 1;
    }



          (function IndexArrayShift(shiftedNext, nextNextElement){
            //given nextNextElement, perhaps we can define the nextNextElement 

            var nextNextPlacement = () => {
              //given the nextNextElement, get the 
              var theElementDBid = nextNextElement.getAttribute('dbid');
              for(let i = 0; i < AttrsWithKeys.length; i++){
                if(AttrsWithKeys[i].unique_key === theElementDBid){
                  return AttrsWithKeys[i].placement;
                }
              }
            }

            var nextNextIndex = () => {
              //given the nextNextElement, get the 
              var theElementDBid = nextNextElement.getAttribute('dbid');
              for(let i = 0; i < AttrsWithKeys.length; i++){
                if(AttrsWithKeys[i].unique_key === theElementDBid){
                  return i;
                }
              }
            }

            /*
            if the incremented value of nextPlacement clashes with the 
            value of the next index....
            */

            if (shiftedNext >= nextNextPlacement()){

            /*=============
            Then shift the nextNextElement's placement over 1
            =============*/
            let nextNextShifted = digitShift(nextNextPlacement());
            /*------
            set this as the new value in AttrsWithKeys
            -------*/

            AttrsWithKeys[nextNextIndex()-1].placement = nextNextShifted;
            if(nextNextIndex() != AttrsWithKeys.length-1){
              var nextNextNext = getNextNextElement(nextNextElement)
            }else{
              //we're done- we've hit the end of the line.  
              return false;
            }

            /*============
            if the next index is the same, shift it too! 
            =============*/
            if (nextNextShifted === nextNextNext){
              IndexArrayShift(nextNextShifted, nextNextNext, nextIndexGlobal);
            }
           }
          })(shiftedNext, nextNextElement);




    //Actually, I don't need to be resorted since it doesn't matter what order we update in.  

    /*==============
    Now we have our sorted, updated AttrsWithKeys.  

    Let's update this information in Firebase. 
    ==============*/


    for(let i = 0; i < AttrsWithKeys.length; i++){
        firebase.database().ref('pages/'+this.state.CurrentEditPageHandle+"/tags/"+AttrsWithKeys[i].unique_key).update({placement : AttrsWithKeys[i].placement})
        //this.state.PagesSnapshot.child(this.state.CurrentEditPageHandle).child("tags").child(AttrsWithKeys[i].unique_key).update({placement : AttrsWithKeys[i].placement});
        }
      

    this.state.PagesSnapshot.child(this.state.CurrentEditPageHandle).forEach(function(childSnap){
      for(let i = 0; i < AttrsWithKeys.length; i++){
        if(AttrsWithKeys[i].unique_key === childSnap.val()){
          childSnap.child(AttrsWithKeys[i].unique_key).update({placement : AttrsWithKeys[i].placement});
        }
      }
    });



    


    ///////////////////

    //This should be the end of the code,
    //assuming that everything went as planned. 

    //////////////////






/*
    if(movedElement.hasChildNodes){
      nextElement = movedElement.children;
      nextFlag = "child";
    } 
*/

    //////
    // Since these will be indexed values, we need to cast them into an array 
    // Which then we can use to compare digit values
    //////

      //if prior is 1.2 and we are a top-level sibling 
      //let's assume that the drag and drop api will put places appropriately


/*



    OLD OLD OLD OLD OLD 


      if(typeof(priorPlacement) === "number"){
        var priorString = priorPlacement.toString().split('.');  //ex: [1, 1, 1] assuming prior placement is '1.1.1'
      } else{
        var priorString = priorPlacement.split('.'); 
      }

      //The last digit will be used for comparing
        //ex : 1.1.2 1.1.3  <- 2 and 3 are the last digits 

        if(priorString.length > 1){
          var priorLastDigit = priorString[priorString.length-1]; 
        }
      var priorFirst = priorString[0]; //ex: 

      if(typeof(nextPlacement) === "number"){
        var nextString = nextPlacement.toString().split('.');  //ex: [1, 1, 1] assuming prior placement is '1.1.1'
      } else{
        var nextString = nextPlacement.split('.'); 
      }

      if(nextString.length > 1){
        var nextLastDigit = nextString[priorString.length-1];
      }
      var nextFirst = nextString[0];

      ////
      //thisIndex will be the new index that we will assign to the dragged element, assuming there is a need to update 
      ////
      var thisIndex = [priorFirst]; //since the index won't begin with a ".", assign this as the first
      var thisIndexString;  //This will be the value we'll populate later. 

      if(!priorLastDigit){
        thisIndexString = thisIndex[0];
        var thisDigit = priorLastDigit + 1;
      } else{
        var thisDigit = priorLastDigit + 1;
      }


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



/*

        var AWKToUpdate = []
        var nextOrPrior;

        for(let l = 0; l < AttrsWithKeys.length; l++){
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

/*    OLD OLD OLD



            for(let i = 0; i < updatedIndices.length ; i++){
              dbRef.child(updatedIndices[i].uID).update({
                placement : updatedIndices[i].placement
              });
            }
          }

        }

        //ex: 
        // 1.1 1.2 1.3 1.3 <- (plop) 1.4 1.5

        firebase.database().ref('pages/'+this.state.CurrentEditPageHandle+"/tags/")


*/

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

