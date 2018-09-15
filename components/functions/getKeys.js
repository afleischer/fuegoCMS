import firebase from '../../firebase';


export const getKeys = (path) => {

	keyList = [];
	var pathToTags = path+pageURL+'/tags/';

	firebase.database().ref(pathToTags).forEach(function(snap){
		var key = Object.keys(snap);
		pathToTags.push(key)
	})

	return keyList;
}