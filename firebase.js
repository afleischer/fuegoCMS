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


	/*=================
	Authentication handling
	=================*/

	window.onload = function(){
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser){
				console.log(firebaseUser);
				var login_text = document.getElementById('login_require_text');
				login_text.classList.remove('login_require_text_shown');
				login_text.classList.add('hide');
				btnLogout.classList.remove('hide');
			} else {
				document.getElementById('login').classList.add('modal');
				btnLogout.classList.add('hide');
			}
		})		
	}

	const txtEmail = document.getElementById('txtEmail');
	const txtPassword = document.getElementById('txtPassword');
	const btnLogin = document.getElementById('btnLogin')
	const btnSignUp = document.getElementById('btnSignUp');
	const btnLogout = document.getElementById('btnLogout');


	//add login event

	document.addEventListener('load', () => {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(!firebaseUser){
				document.getElementById('login').classList.add('modal');
			}
			if(firebaseUser){
				document.getElementById('login').classList.remove('modal');
				document.querySelector('.login_require_text_shown').classList.add('hide');
			}
		})
	})

	btnLogin.addEventListener('click', e=> {
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();

		//Sign in 
		const promise = auth.signInWithEmailAndPassword(email, pass);
		//if user, will log in.  If not, will catch error and log it to the console 
		promise.catch(e => console.log(e.message));
		console.log("logged in!");
	})

	btnSignUp.addEventListener('click', e=> {


		//todo: check for email 
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();

		//when clicked, if null enter a value
		if(!email || !pass){
			var error_box = document.getElementById('login_error');
			error_box.innerHTML = "You must enter a valid username or password";
			error_box.classList.add('err_visible');
			setTimer(() => {error_box.classList.remove('err_visible')}, 500);
			return false;
		}

		//Sign in 
		const promise = auth.createUserWithEmailAndPassword(email, pass);
		//if user, will log in.  If not, will catch error and log it to the console 
		promise.catch(e => console.log(e.message));		

		//Record authentication, attach a listener

		//firebaseUser will be populated if logged in, null if not
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser){
				console.log(firebaseUser);
				document.getElementById('login').classList.remove('modal');
				var login_text = document.getElementById('login_require_text');
				login_text.classList.remove('login_require_text_shown');
				login_text.classList.add('hide');
				btnLogout.classList.remove('hide');
			} else {
				console.log('not logged in');
				document.getElementById('login').classList.add('modal');
				btnLogout.classList.add('hide');
			}
		})

	});

	btnLogout.addEventListener('click', e=> {
		firebase.auth().signOut();
	})


export default firebase;
