import React, { Component } from 'react';

var firebase = require("firebase/app");



const ImageItem = (props) => {

    var returnArray = [];
    //const storageRef = firebase.storage().ref();
    var Metadata = props.Metadata;
    
    try{
      for(let i = 0; i < Metadata.length; i++){

        var imageName = Metadata[i].image_name;
        var imageUrl = Metadata[i].image_url;
        //onClick = {this.setFrameProperties(e,"img", imageName,"position: relative;")}
        returnArray.push(<div className = "thumbnail_div" key = {i} ><p className = "thumbnail_name">{imageName}</p><img className = "thumbnail" src ={imageUrl} /></div>);
        
      }
    }catch(error){
      returnArray.push(<div key="shutupreact">foo</div>);
    }

return returnArray;

}



export class ImageAddContainer extends React.Component{
  constructor(props){
    super(props);


    const databaseImageRef = db.ref('image_data');
    const storageRef = firebase.storage().ref();


  databaseImageRef.on("value", snapshot => {
    var metadata_array = [];
      snapshot.forEach(function (childSnapshot) {
        var RDB_image_name = childSnapshot.val().image_name;
        var RDB_image_url = childSnapshot.val().image_url;
        metadata_array.push(
          {image_name : RDB_image_name,
          image_url : RDB_image_url}
          );
      });


      this.setState({
        image_metadata : metadata_array
      });
      
  });

    this.addTagToFrame = this.addTagToFrame.bind(this);


  }
  state = {

    image_metadata : null

  }

  addTagToFrame(event, tag, style, CurrentEditPageHandle){

    //Get a reference to the page being edited
    var pageURL =  this.props.CurrentEditPageHandle;

    try{
    var pageRef = firebase.database().ref('pages/').child(pageURL);
    var snapshot = this.state.PagesSnapshot;
    }

    catch(error){
      return "Loading...";
    }
     
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

    var updates = {};
      updates['/pages/' + newTagKey] = tagData;

    pageRef.update(updates);

  }

  //or I could send this to firebase storage...  


    //TO ADD BELOW ONCE THE TEXTITEM IS CONFIRMED WORKING: 
    // onClick = {this.addTagToFrame(event, 'img', null)}
  render(){
    return(
      <div className = "image_add_container">
        <ImageItem  Metadata = {this.state.image_metadata} />
      </div>
      );
  }

}