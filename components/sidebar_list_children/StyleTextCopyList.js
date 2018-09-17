import React, { Component } from 'react';

import Style from 'style-it';

import firebase, {sortedPagesSnapshot} from '../../firebase.js';
//import {HTMLTag} from '../functions/HTMLGenerator';

/*=============
List for styling text copy
=============*/

export const StyleTextCopyList = (props) => {

  //order by child "placement", filter by page id 

  try{
    var currentPage = props.currentPage;
    var snapshot = props.snapshot;
    //var pageSnapshot = snapshot.child(currentPage).child("tags")
    //var pageSnapshot = firebase.database().ref('pages/'+currentPage+'/tags/');

    var sortedPageSnapshot = new sortedPagesSnapshot(currentPage); 
    var keyArray = Object.keys(sortedPageSnapshot.val());

    var placementArray = []
    var returnArray = [];

    snapshot.child(currentPage).child("tags").child(keyArray[0]).val()

    if(!currentPage && snapshot){
      return(<div className = "select_page_notice_style">Select a page to start editing</div>);
    }

    if( currentPage && snapshot){


      let key = 0;

      for (let i = 0; i < keyArray.length; i++){
        //get the "placement" tag of the value 
        let tagValues = sortedPageSnapshot.child(keyArray[i]).val();
        placementArray.push(tagValues.placement);
      }

      for (let i = 0; i < keyArray.length; i++){
        //already ordered in order of increasing placement variable
        let tagValues = sortedPageSnapshot.child(keyArray[i]).val();
        let type = tagValues.tag_type;
        let content = tagValues.content;
        let placement = tagValues.placement;
        
        let newTagObj = new HTMLTag(snap.tag_type, snap.content, snap.placement, snap.attributes);
        //let newTagJSX = newTagObj.generateHTMLTag(placementArray);

        keyArray.push(returnArray);
      }

      //getPageSnapshot


      /* 
      snapshot.forEach(function (childSnapshot){
        let value = childSnapshot.val();
        let styled = Style.it(`{value.tags.style}`);
        //if the child is of the type "p"
        if(childSnapshot.child('p')){
          paragraphArray.push(value.tags.content);

          paragraphArray.push(<p key = {key}>{value.tags.content}</p>);
          key++;
        }else if(childSnapshot.child('h1')){
          //h1Array.push(value);
          h1Array.push(<h1 key = {key}>{value.tags.content}</h1>);

        }else if(childSnapshot.child('h2')){
          //h2Array.push(value);
          h2Array.push(<h2 key = {key}>{value.tags.content}</h2>);

        }else if(childSnapshot.child('h3')){
          //h3Array.push(value);
          h3Array.push(<h3 key = {key}>{value.tags.content}</h3>);
        }

      });
      */

      
      //returnArray = [(<div className = "style_list">{paragraphArray}</div>), (<div className="style_list">{h1Array}</div>), (<div className = "style_list">{h2Array}</div>),(<div>{h3Array}</div>)];
      returnArray = [(<div><h2 className = "style_subheader">Text Elements ("P" tag)</h2><div className = "style_list">{paragraphArray}</div> </div>), (<div><h2 className = "style_subheader">Large Headers ("h1" tag)</h2><div className="style_list">{h1Array}</div> </div>), (<div><h2 className = "style_subheader">Medium Headers ("h2" tag)</h2><div className = "style_list">{h2Array}</div></div>),(<div><h2 className = "style_subheader">Small Headers ("h3" tag)</h2><div>{h3Array}</div></div>)];
      //let returnArrayFinal = (<div>{returnArray}</div>)

      return returnArray;

    }else{
      return (<div>Loading...</div>);
    }


  }catch(error){
    return (<div>Loading...</div>);
  }

}