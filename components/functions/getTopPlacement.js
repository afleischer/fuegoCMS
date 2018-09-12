import firebase from '../../firebase.js'

export const getTopPlacement = (pageEditing) =>{

    let placement_counter;
    /*=============
    Get the most recent "placement" variable and set this to "placement" + 1
    =============*/
	try{

	  firebase.database().ref('pages/' + pageEditing+'/tags/').orderByChild('placement').limitToLast(1).once('value', function(snapshot) {
	        console.log("Test!");

	        let keyname = Object.keys(snapshot.val())[0];

	        placement_counter = snapshot.child(keyname).val().placement;
	        if(!placement_counter){
	          placement_counter = 0;
	        }
	      });


	  return placement_counter;
	}catch(error){

	}

}