//var firebase = require('firebase');
import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';


var database = firebase.database();


export default class App extends React.component{
    state = {

	
	//Number of elements
	

    }



    //In render, pass the state of the div  down as props to the

    render(){
	return(
	    

	);
    }

    
    
}


/*
BASIC ASCII MOCKUP OF BASIC CMS FUNCTIONALITY:


//


*/


/*============
Basic CMS functionality 
============*/

//
//  Container for updating a text post within the CMS
//


const TextField = () => {
    
}


export default class CMSContainerTextPost extends React.component{
    
    state = {
	blogText : "Enter Text Here"
    }

    //To review: Events in ReactJS
	
    updateBlogTextState = () => {
	let updateText = {event.target.value};
	
	//Will having updateText in brackets recognize it as a variable? 
	//Review bracket syntax in JSX 
	this.setState({blogText : updateText});
	

	//Send to Firebase (will be stored in ref called 'blogs')
	

	 
    }

    sendBlogTextToDB = () = {
	let blogEntryCopy = this.state.blogText;
	let currentDateTime = /* get the current date/time! */ ;
	database.ref('blogs/' + currentDateTime).set({
	    //If current date time, no need to have folder selection

	    //Double-check syntax for how to add blog syntax!
	    blogEntryCopy;
	});

	database.ref('copy-folders/' + copyFolder).set({

	)};
    }
    

	/*  OLD "UpdateBlog" code
    //Will be triggered onClick 
    UpdateBlog = () => {
	
	//Get the content within the textfield
	
	
	
	//Format to send to Firebase
	
	
	//Send to Firebase (will be stored in ref called 'blogs')
	database.ref('blogs/' + blogEntryCopy).set({
	    //Need to fetch last instance of 
	    
	});

	database.ref('copy-folders/' + copyFolder).set({

	)};

	
	//Clear fields
	
    }
*/
    
    

    render(){
	return(    
		<h2>Blog Copy Update </h2>
		//Todo: Add upload button to get file from computer
	    //This will be called "content_upload" 
		<input id = "blog-copy" type = "longtext" placeholder = "Enter Text Here" onChange = {this.updateBlogText}>/* >> TD: set type to  */ </input>
		<button onClick = {this.sendBlogTextToDB} id = "submission">SUBMIT POST</button>
	);
    }
    
}



/*=============
End Basic CMS Functionality
=============*/



export default class VisualEditor extends React.component{

    //for now, just have new items pop in when selecting from the sidebar. 

    
    render(){
	return(
	    <EditorWindow />
	);
    
}

//code apeing: https://stackoverflow.com/questions/46818687/react-changing-css-property-on-click-arrow-function


//NOTE: Can I do a multi-line for an ES6 arrow function???
const NavButton = ({onClick}) =>
      <button className = "sidebar-toggler sidebar-toggler-right" style ={{backgroundColor: 'blue',  position: "absolute", margin: "30px"}}type="button" data-toggle="collapse" data-target="#collapsingNavbar" onClick={onClick}>
    <div id="nav-icon1">
      <span></span>
      <span></span>
      <span></span>
    </div>

      </button>

const SidebarMenu = ({show}) => <div style = {{visibility : show ? "visible" : "hidden" , backgroundColor : "#565151" , position : "absolute", height : "100vh" , width : "200px"}}> </div>


    
    export default class InnerMenu extends React.component{
	//Can I have a class nested within another class?
	state = {
	    
	}

	//Get functionality now, add form later.

	addDiv = () => {


	    //Pass up the state to App to pass to the VisualEditor
	    //Previously I binded this downwards, so in App I'll need to bind this to this class
	    
	}
    }  
    
export default class Sidebar extends React.component{

 state = { 
     sidebarVisible : false,
  }
 

   toggleVisible = () => this.setState(state => ({
         sidebarVisible : !state.sidebarVisible,
   }));

    render(){
	return(
	    <div class = "SidebarDiv">
		<SidebarMenu show = {this.state.sidebarVisible}>
		<InnerMenu />
	    </SidebarMenu>
		<HideShowBtn onClick = {this.toggleVisible} />
	    </div>
	);
    }

}

    


export default class SidebarMenu extends React.component{


    render(){
	return(){
		<div>
		
	}
    }

}

ReadDOM.render(
	<App />,
    document.getElementbyId('root')
);
