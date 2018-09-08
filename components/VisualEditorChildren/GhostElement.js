import React, { Component } from 'react';

import firebase from '../../firebase.js';



/*
try {
    let firApp = firebase.app("FuegoCMS");
    return firApp;
  } catch (error) {
    return firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: firebaseUrl
    }, FuegoCMS);
  }
*/

class GhostElement extends React.Component{
  constructor(props){
    super(props);

    this.ghostFunction = this.ghostFunction.bind(this);
  }


ghostFunction(){
  const snapshot = this.props.Snapshot;

    if(snapshot){

    const currPage = document.querySelector('#page_selector').value;

      if(currPage != "" && currPage != 'Loading'){


      var pageTags = [];

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
  }

  return "Loading Content...";
}

  render(){
    return(
      (<div>{this.ghostFunction()}</div>)
      );
    }

}

export default GhostElement;