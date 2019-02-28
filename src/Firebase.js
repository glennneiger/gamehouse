
import * as firebase from 'firebase';

import config from './config/keys';


var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jacobsgamehouse.firebaseio.com"
});



firebase.initializeApp(config);
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage().ref();