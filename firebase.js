import firebase from 'firebase'


const config = {
    apiKey: "AIzaSyDQw0Fa9jY-8uXxMOf-Jr7XA6er3C8pOPA",
    authDomain: "fuegocms.firebaseapp.com",
    databaseURL: "https://fuegocms.firebaseio.com",
    projectId: "fuegocms",
    storageBucket: "fuegocms.appspot.com",
    messagingSenderId: "283527892810"
};
firebase.initializeApp(config);


export default firebase;
