import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/database';
  import 'firebase/firestore';
  import 'firebase/messaging';
  import 'firebase/functions';
  import 'firebase/storage';

//Initialize firebase within the app
//export const firebase_initialize = () => {
	


  var config = {
      apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
      authDomain: "fuegocms.firebaseapp.com",
      databaseURL: "https://fuegocms.firebaseio.com",
      projectId: "fuegocms",
      storageBucket: "fuegocms.appspot.com",
      messagingSenderId: "283527892810"
    };

firebase.initializeApp(config);

//}
