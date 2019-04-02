import * as firebase from 'firebase';
import { auth, database } from '../Firebase';


export const signInWithGoogle = ()=> {
  var provider = new firebase.auth.GoogleAuthProvider();

  provider.addScope('https://www.googleapis.com/auth/plus.login');

  auth.signInWithRedirect(provider);
}

export const signOut = async ()=> {
  if (auth.currentUser) database.ref(`users/${auth.currentUser.uid}`).off();
  let res = await auth.signOut().then(function() {
    res = true;
  }).catch(function(error) {
    res = error;
  });
  return res;
}

export const deleteAccount = async ()=> {
  database.ref(`users/${auth.currentUser.uid}`).remove();
  let res = await auth.currentUser.delete().then(function() {
    res = true;
  }).catch(function(error) {
    res = error;
  });
  signOut();
  return res;
}

export const getSignIn = async callback => {
  const getUserInfo = async auth=> {
    let res=null;
    let userNode = database.ref(`users/${auth.uid}`);
    await userNode.once('value', async data => {
      const user = await data.toJSON();
      if (user) {
        res = user;
      } else {
        const newUser = {
          name: auth.displayName.split(' ')[0].substring(0, 12), // take first name, limit to 12 chars
          img: auth.photoURL
        }
        userNode.set(newUser);
        res = newUser;
      }
    });
    return res;
  }

  if (callback) {

    auth.onAuthStateChanged(async auth=> {

      if (auth) {

        database.ref(`users/${auth.uid}`).on('value', async data => {
          const value = await data.toJSON();
          callback(value);
        }); 

        getUserInfo(auth); 

      } else {
      // User is signed out.
        callback(null);
      }
    });
  }

  let res=null;
  if (auth.currentUser) {
    res=await getUserInfo(auth.currentUser);
  }
  return res;
}


export const updateUser = (update) => {
  database.ref(`users/${auth.currentUser.uid}`).update(update);
}