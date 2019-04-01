import * as firebase from 'firebase';
import { auth, database } from '../Firebase';


export const signInWithGoogle = ()=> {
  var provider = new firebase.auth.GoogleAuthProvider();

  provider.addScope('https://www.googleapis.com/auth/plus.login');

  auth.signInWithRedirect(provider);
}

export const signOut = async ()=> {
  let res = await auth.signOut().then(function() {
    res = true;
  }).catch(function(error) {
    res = error;
  });
  return res;
}

export const getSignIn = callback => {

  const getUserInfo = auth=> {
      let userNode = database.ref(`users/${auth.uid}`);
      return userNode.once('value', async data => {
      const user = await data.toJSON();
      if (user) {
        return user;
      } else {
        const newUser = {
          name: auth.displayName.split(' ')[0],
          img: auth.photoURL
        }
        userNode.set(newUser);
        return newUser;
      }
    });
  }

  auth.onAuthStateChanged(async auth=> {
    let res;
    if (auth) {
      const data = await getUserInfo(auth);  
      res = await data.toJSON();
    } else {
     // User is signed out.
      res = null;
    }
    callback(res);
  })
}


export const updateUser = (update) => {
  database.ref(`users/${auth.currentUser.uid}`).update(update);
}