import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import base from 're-base';


import firebase from './firebase.js';
//import { firebase, helpers } from 'react-redux-firebase';

import IndexSort from './components/functions/IndexSort';

import { connect } from 'react-redux';
//import { store } from './store/index';



import { fetchData, ghostFlag, dropDowned, addAttribute, setSelectedItem } from './actions/docActions';
import { rootReducer } from './reducers/reducers';

//const { isLoaded, isEmpty, pathToJS, dataToJS } = helpers

//import an exampleAction 

import 'CSS.escape';
import { undoAction, redoAction } from './components/functions/setupUndo';
import "./actions/docActions.js";

import Style from 'style-it';
import Iframe from 'react-iframe';
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

import { store } from './store/index';


/*============
Firebase initialization
============*/

const dbPageRef = firebase.database().ref('pages/');


/*===========
*
* Begin App
*
============*/

class App extends React.Component{
  constructor(props){
    super(props);

    this.setFrameProperties = this.setFrameProperties.bind(this);
    this.getCounter = this.getCounter.bind(this);
    this.setPage = this.setPage.bind(this);
    this.updateCurrentEditPageHandle = this.updateCurrentEditPageHandle.bind(this);
    this.setSelectedElement = this.setSelectedElement.bind(this);
    this.pageVsSection = this.pageVsSection.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.reIndex = this.reIndex.bind(this);
    this.getGhosted = this.getGhosted.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.retrieveSnapshot = this.retrieveSnapshot.bind(this);


  }


    state = {
    TextList : null,
    ImageList : null,
    /*CurrentEditPage : null,*/
    /*PagesSnapshot : null,*/
    /*selectedElement : null,*/
    sidebar_shown: "sb_shown",
    ghosted: false, 
    draggedElement: null,
    upload_arrow: "down",
    add_arrow_1: "down_arrow",
    add_arrow_2: "down_arrow",
    style_arrow: "down_arrow"
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
        

        store.dispatch('DROPDOWN-FIRST');

        /*

        this.setState({
          CurrentEditPageHandle : dropdown_first
        })
        */
        }
        catch(error){
          return "loading first value...";
        }
      }

      }

      else if (e){
        let dropdown_selected = e.target.value;
         let DropdownSelection = e.target.value;

         store.updateHandle('CURRENTEDITPAGE', DropdownSelection);

         /*
        this.setState({
      CurrentEditPage : "src/"+DropdownSelection+".html",
      CurrentEditPageHandle : DropdownSelection
    });
        */

      }
  }

setFirstPage(input){
  let fetchVar = input;

  if(fetchVar){
    setEditPage();

    function setEditPage(){
      var update = {
        CurrentEditPage : "src/"+fetchVar[0]+".html",
        CurrentEditPageHandle : fetchVar[0]       
      }
      return update;
    }


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
  
  store.dispatch(setSelectedItem(element_selected));

  //this.setState({selectedElement : element_selected});


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
    var movedElement = this.props.draggedElement;
    var priorElement = e.target.previousSibling;
    var nextElement = e.target.nextSibling;
    var priorElementUid = priorElement.getAttribute("dbid");
    var nextElementUid = nextElement.getAttribute("dbid");
    var thisElementUid = movedElement.getAttribute("dbid");
    //var dbRef = firebase.database().ref("pages/"+this.props.PageHandle+"/tags/").once('value', (snap)=> { });
    var dbRef = this.props.PagesSnapshot.child(this.props.CurrentEditPageHandle).child("tags");
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
            if the inmented value of nextPlacement clashes with the 
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
        firebase.database().ref('pages/'+this.props.CurrentEditPageHandle+"/tags/"+AttrsWithKeys[i].unique_key).update({placement : AttrsWithKeys[i].placement})
        //this.props.PagesSnapshot.child(this.props.CurrentEditPageHandle).child("tags").child(AttrsWithKeys[i].unique_key).update({placement : AttrsWithKeys[i].placement});
        }
      

    this.props.PagesSnapshot.child(this.props.CurrentEditPageHandle).forEach(function(childSnap){
      for(let i = 0; i < AttrsWithKeys.length; i++){
        if(AttrsWithKeys[i].unique_key === childSnap.val()){
          childSnap.child(AttrsWithKeys[i].unique_key).update({placement : AttrsWithKeys[i].placement});
        }
      }
    });

  }


updateCurrentEditPageHandle(toUpdate){

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
    if(this.props.selectedElement != null){
      return("Section :"+this.props.selectedElement)
    }else if (this.props.selectedElement == null){
      return("Page")
    }
  }


  addAttributes(event){

  }


  toggleSidebar(){
    //if the item is closed 
    var sidebar_status = this.props.sidebar_shown === "sb_hidden" ? "sb_shown" : "sb_hidden";
    console.log(sidebar_status);

    this.setState({
      sidebar_shown : sidebar_status
    })
  }

  toggleMenu(type, section){

    window.clearInterval();
    var flagTurn = type; 
    var arrowState = this.props[type];
    var section_menu = document.querySelector(section);
    var height = document.querySelector(section).offsetHeight;

    if (arrowState === "up"){
      var h = 0;
      let intval = setInterval(function(){
        for(var i = 0; i < 100; i++){
          h++;
          section_menu.style.height = h + 'px';
          if(h >=height){
            window.clearInterval(intval);
          }          
        }
      }, 10);
    } else if(arrowState ==="down"){
      var h = height;
      let intval = setInterval(function(){
        for(var i = 0; i < 100; i++){
          h--;
          section_menu.style.height = h + 'px';
          if(h <=0){
            window.clearInterval(intval);
          }
        }

      }, 10);
    }
    var updated_arrow_state = arrowState === "down" ? "up" : "down";


    //Update state 
    dropDowned(flagTurn, updated_arrow_state);

    this.setState({
      [flagTurn] : updated_arrow_state
    });

  }


  getGhosted(ghostCall){
    let nowGhost = ghostCall;

    //store.dispatch(ghostFlag(nowGhost))
    ghostFlag(nowGhost);
/*
    this.setState({
      ghosted: ghostCall
    });
*/
  }

/*
  <div className = "Grand_HTML_list">
  <GrandHTMLList PagesSnapshot = {this.props.PagesSnapshot} CurrentEditPageHandle = {this.props.CurrentEditPageHandle} />
  </div>

*/


  retrieveSnapshot(type){
    if(type == 'blogs'){
      if(!this.props.BlogSnapshot){
        return null;
      }
      else{
        return this.props.BlogSnapshot;
      }
    }

    if(type == 'page'){
      if(!this.props.PagesSnapshot){
        return null;
      } 
      else{
        return this.props.PagesSnapshot;
      }
    }
    
    if(type == 'image'){
      if(!this.props.ImageSnapshot){
        return null;
      }
      else{
        return this.props.ImageSnapshot;
      }
    }
    
  }


  componentWillMount(){
    /*================
    Map Props from mapDispatchToProps/mapStateToProps
    ================*/


  firebase.database().ref('pages/').on('value', snapshot => {
    if (snapshot.val()){
    fetchData('PAGESNAPSHOT', snapshot);
    }
  });


  firebase.database().ref('blogs/').on('value', snapshot => {
    if (snapshot.val()){
    fetchData('BLOGNAPSHOT', snapshot)
    }
  });



  firebase.database().ref('image_data/').on('value', snapshot => {
    if (snapshot.val()){
    fetchData('IMAGESNAPSHOT', snapshot)
    }
  });

/*
    firebase.database().ref('pages/').on('value', snapshot => {
      //store.dispatch(fetchData("PAGESNAP", snapshot)); 
      this.props.fetchData("PAGESNAP", snapshot);      
    });

    firebase.database().ref('blogs/').on('value', snapshot => {
      //store.dispatch(fetchData("BLOGSNAP", snapshot));
      this.props.fetchData("BLOGSNAP", snapshot); 
    });

    firebase.database().ref('image_data/').on('value', snapshot => {
      //store.dispatch(fetchData("IMAGESNAP", snapshot));
      this.props.fetchData("IMAGESNAP", snapshot);
    });

*/


  }

 
    render(){

	//const {firebase} = this.props;  //why the curly braces?
	

  return(

    <span className = "app-container" id = {this.props.sidebar_shown}>

      <div className="sidebar" >

          <h1>Upload Content </h1> 
          <div className = "arrow-down" onClick = {(e) => {this.toggleMenu("upload_arrow",".pload_content")}}></div>
          <div className = "upload_content"> 
            <CMSContainerTextPost />
            <CMSContainerImageUpload /> 
          </div>

            <h1>Add to {this.pageVsSection()}</h1> 
            <div className = "arrow-down" onClick = {(e) => {this.toggleMenu("add_arrow_1",".add_content_1")}}></div>

          <div className = "add_content_1"> 
            <h2 className="page-add-subheader">Content</h2>
            <TextAddContainer BlogSnapshot = {this.retrieveSnapshot('blogs')} CurrentEditPageHandle = {this.props.CurrentEditPageHandle} TextArray = {this.props.TextList} />
            <SidebarImageContainer CurrentEditPageHandle = {this.props.CurrentEditPageHandle} ImageArray = {this.props.ImageList} />
          </div>

            <div className = "arrow-down" onClick = {(e) => {this.toggleMenu("add_arrow_2",".add_content_2")}}></div>

          <div className= "add_content_2">
            <h2 className="page-add-subheader">Page Elements</h2>
            <AddElementsToPage SelectedElement = {this.props.selectedElement} CurrentEditPageHandle = {this.props.CurrentEditPageHandle} />

          <h1>Style Page Content</h1>
          <div className = "arrow-down" onClick = {(e) => {this.toggleMenu("style_arrow",".style_content")}}></div>
          <div className = "style_content"> 
            <StyleContentList PageSnapshot = {this.retrieveSnapshot('page')} ImageSnapshot = {this.retrieveSnapshot('image')} SelectedElement = {this.props.selectedElement} CurrentEditPageHandle = {this.props.CurrentEditPageHandle} />
          </div>

            <h2 className="page-add-subheader">Preset Elements</h2>
            <AddPreset PagesSnapshot = {this.retrieveSnapshot('page')} CurrentEditPageHandle = {this.props.CurrentEditPageHandle} ImageArray = {this.props.ImageList} />
          </div>

          </div>

      <div className = "VisualSection">
        <button className = "collapse" onClick = {this.toggleSidebar}>TOGGLE SIDEBAR</button>
        <VisualEditor getGhosted = {this.getGhosted} ghosted = {this.props.ghosted} setSelectedElement = {this.setSelectedElement} reIndex = {this.reIndex} currentPage = {this.props.CurrentEditPage} pageHandle = {this.props.CurrentEditPageHandle} updateCurrentEditPageHandle = {this.updateCurrentEditPageHandle} SetPage = {this.setPage} />
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


const mapStateToProps = (state, ownProps)  => {
  
  return{
    PagesSnapshot : state.PagesSnapshot,
    BlogSnapshot : state.BlogSnapshot,
    ImageSnapshot : state.ImageSnapshot,
    CurrentEditPageHandle : state.CurrentEditPageHandle
  } 
}

const mapDispatchToProps = dispatch => {
  return {
      fetchData: (typeVar, snapshot) => dispatch(fetchData (typeVar, snapshot)),

    updateHandle: (handle) => dispatch(updateHandle(handle)),

    ghostFlag: (flag) => dispatch(ghostFlag(flag)),

    setSelectedItem: (element_selected) => dispatch(setSelectedItem(element_selected)),

      dropDowned: (flagTurn, updated_arrow_state) => dispatch(dropDowned(flagTurn, updated_arrow_state)),

    addAttribute: (event) => dispatch(addAttribute(event.target.value))

  }
}


/*============
Render the Virtual DOM  *****moved to index.js ******
============*/

/*

ReactDOM.render(
  <Provider store = {store}>
  <App />
  </Provider>,

    document.getElementById('root')
);

*/
//module.exports = App;


export default connect(mapStateToProps, mapDispatchToProps)(App);
