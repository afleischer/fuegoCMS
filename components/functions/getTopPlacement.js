import firebase from '../../firebase.js'

export const getTopPlacement = (pageEditing) =>{
	try{

		//var toplevel_counter = firebase.database().ref('pages/' + pageEditing+'/tags/').orderByChild('placement').limitToLast(1);
		var toplevel_counter = null;
		firebase.database().ref('pages/' + pageEditing+'/tags/').orderByChild('placement').limitToLast(1).once('value', function(snapshot) {
			console.log("break");
			toplevel_counter = snapshot.val().placement;
		});


		var collection_counter;

		firebase.database().ref('/pages'+pageEditing+'/collections/').orderByValue('placement').limitToLast(1).once('value', function(snapshot){
			console.log("break");
			collection_counter = snapshot.val().placement;

		});

		if (toplevel_counter > collection_counter){
			let counter = toplevel_counter;
			counter++;
		}else if (collection_counter > toplevel_counter){
			let counter = collection_counter;
			counter++;
		}

		counter = counter + 1;
		return counter;

	}catch(error){
		if(toplevel_counter  && !collection_counter){
			counter = toplevel_counter;
			counter++;
		}
		else if(!toplevel_counter && collection_counter){
			counter = collection_counter;
			counter++;
		}else if (!toplevel_counter && !collection_counter){
			counter = 1;
		}

		return counter;
	}


}
