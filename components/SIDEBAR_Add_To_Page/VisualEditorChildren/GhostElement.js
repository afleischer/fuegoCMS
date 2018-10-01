import React, { Component } from 'react';

import firebase from '../../../firebase.js';


class GhostElement extends React.Component{
  constructor(props){
    super(props);

    this.ghostFunction = this.ghostFunction.bind(this);
    this.isVoid = this.isVoid.bind(this);
  }

/*==============
Pulls from the database to populate a "ghost function" 
--Activates automatically 
==============*/

ghostFunction(){

   // this.props.clearHTML();


   if(this.props.ghosted === true){
    return false;
   }

  const snapshot = this.props.Snapshot;

    if(snapshot){

    var currPage = this.props.PageHandle;
    //const currPage = document.querySelector('#page_selector').value;

      if(currPage != "" && currPage != 'Loading' && currPage != null){

        if (snapshot.child(currPage).val() === null){ return "Select Page to Load."}

        var pageTags = [];
        var page_tag_pull = Object.keys(snapshot.val());

        /*========
        We grab every unique que from our database snapshot and render them. 
        =========*/
        var uniqueKeys = snapshot.child(currPage).val().tags;

        let anArray = [];


        var uniqueKeysArray = Object.keys(uniqueKeys);
        var current_page_node = snapshot.child(currPage);

        var orderedSnap = this.props.orderedPagesSnapshot;

        var pageTagsNew = [];


        /*===========
        We need to re-order the keys according to the placement.  
        So, for each unique key, get the corresponding value.  
        ============*/

        var keyPlacementArray = []
        for(let i = 0; i < uniqueKeysArray.length; i++){
          let placementVal = snapshot.child(this.props.PageHandle).child("tags").child(uniqueKeysArray[i]).val().placement;
          let keysVal = uniqueKeysArray[i];
          let update = {uID : keysVal, placement : placementVal}
          pageTagsNew.push(update);
        }

        function compare(a,b){
          if(a.placement < b.placement){
            return -1;
          }
          if(a.placement > b.placement){
            return 1;
          }else{
            return 0;
          }
        }

        pageTagsNew.sort(compare);

        console.log(pageTagsNew);

      for(let i = 0; i <= pageTagsNew.length-1; i++){
        let uniqueKeyIterator = pageTagsNew[i].uID;
        let child_base = snapshot.child(currPage).child("tags").child(uniqueKeyIterator).val()
        let tag_type = child_base.tag_type;
        //let tag_content = child_base.content;
        let TagContent = child_base.content;
        let tag_placement = child_base.placement;
        //let tag_style = child_base.style;
        
        try{
           var TagAttributes = child_base.attributes;
        }catch(error){
          var TagAttributes = null;
        }

        /*===========
        If a;slkdjf;alksdjf
        ============*/



        var testForTag = /([<->])\w\W*/g ; 



        if(testForTag.test(TagContent) === true && tag_type != "img"){
          //the inner content is a quill block.  let's 
           tag_type = "div";

          TagContent = parseHTML(TagContent); 

          function parseHTML(TagContent){
            var innerTags = [];
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(TagContent, "text/html");
            var innerJSX = [];

            for (let i = 0; i < htmlDoc.body.childNodes.length; i++){
             innerTags.push({type : htmlDoc.body.childNodes[i], 
              contents : htmlDoc.body.childNodes[i].outerText});
            } 
            for(let i = 0; i < innerTags.length; i ++){
             // var TagType = innerTags[i].type;
              var TagType = innerTags[i].type.localName;
              var innerContent = innerTags[i].contents;
              innerJSX.push(<TagType className = "frame-tag">{innerContent}</TagType>);
            }
            
            return innerJSX;
          }
        }
        
        let TagName = tag_type.toLowerCase();



        if(TagAttributes === undefined){
          //this.isVoid(TagName) === true ? pageTags.push(<TagName  onDragOver = {this.props.onDragOver} onDragEnter = {this.props.onDragEnter} onDrop = {this.props.
         // } className = "frame-tag" dbID = {uniqueKeysArray[i]} draggable = "true" onClick = {(e) => this.props.setSelectedElement(e)} src={TagContent} />)  :  pageTags.push(<TagName className = "frame-tag" onDragOver = {this.props.onDragOver} onDragEnter = {this.props.onDragEnter} onDrop = {this.props.reIndex} dbID = {uniqueKeysArray[i]} draggable = "true" onClick = {(e) => {this.props.setSelectedElement}}>{TagContent}</TagName>);  
          this.isVoid(TagName) === true ? pageTags.push(<TagName className = "frame-tag" key = {pageTagsNew[i].uID} dbID = {pageTagsNew[i].uID} draggable = "true" onClick = {(e) => this.props.setSelectedElement(e)} src={TagContent} />)  :  pageTags.push(<TagName className = "frame-tag" dbID = {pageTagsNew[i].uID} draggable = "true" key = {uniqueKeysArray[i]} onClick = {(e) => {this.props.setSelectedElement}}>{TagContent}</TagName>);  
        }else {
          //
          this.isVoid(TagName) === true ? pageTags.push(<TagName className = "frame-tag" key = {pageTagsNew[i].uID} dbID = {pageTagsNew[i].uID} draggable = "true" style = {TagAttributes} onClick = {(e) => this.props.setSelectedElement(e)} src={TagContent} />)  :  pageTags.push(<TagName className = "frame-tag" dbID = {pageTagsNew[i].uID} key = {uniqueKeysArray[i]} draggable = "true" onClick = {(e) => {this.props.setSelectedElement}} style = {TagAttributes} >{TagContent}</TagName>);  
        }

      }

        /*=======
        getGhosted is the flag that will prevent a re-render.  Otherwise, when you
        click on the frame the state changes, triggering a re-render of the ghost element. 
        ========*/

      
        this.props.getGhosted(true);
        return pageTags;
   }



  }

  return "Loading Content...";
}


isVoid(tag_name){

let tagName = tag_name;
let voidFlag = false;

//Checks to see if the element is one of the W3 spec's void elements.
//https://www.w3.org/TR/html5/syntax.html#void-elements

const Voidlist = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  
  Voidlist.forEach((voidTag) => {
    if(voidTag === tagName) voidFlag = true;
  });

return voidFlag; 
}


componentDidUpdate(){
  this.props.setHTML();

}

  render(){
    return(
      (<div className="ghost">{this.ghostFunction()}</div>)
      );
    }

}

export default GhostElement;