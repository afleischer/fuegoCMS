auth.signInWithEmailAndPassword(email, pass);
//signs in existing user, returns promise to resolve user. 

auth.createUserWithEmailAndPassword(email, pass)


//this monitors state change; do this on Login.  Will be null
auth.onAuthStateChanged(firebaseUser => {} );


