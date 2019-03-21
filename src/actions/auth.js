import * as firebase from 'firebase';
import { auth } from '../Firebase';


export const signInWithGoogle = (callback)=> {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  provider.addScope('https://www.googleapis.com/auth/plus.me');

  auth.signInWithRedirect(provider);

  auth.getRedirectResult().then(function(result) {
    if (result.credential) {
      callback(result);
    }
  }).catch(function(error) {
    console.log(error);
  });

  auth.onAuthStateChanged(function(user) {
    let res;
    if (user) {
      res=user;  
    } else {
     // User is signed out.
      res = null;
    }
    callback(res);
  })
}
