var firebase = require('firebase');
import React from 'react';
import ReactDOM from 'react-dom';


var database = firebase.database();


export default class App extends React.component{
    constructor(opts){

    }

    
}


export default class VisualEdit extends React.component{


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

export default class Sidebar extends React.component{

 state = { 
     sidebarVisible : false,
  }
 

   toggleVisible = () => this.setState(state => ({
         sidebarVisible : !state.sidebarVisible,
   }));

    render(){
	return(){
	    <div class = "SidebarDiv">
		<SidebarMenu show = {this.state.sidebarVisible} />
		<HideShowBtn onClick = {this.toggleVisible} />
	    </div>
	}
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
