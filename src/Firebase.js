
import * as firebase from 'firebase';

import config from './config/keys';


firebase.initializeApp(config);
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage().ref();