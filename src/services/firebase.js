import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};
//
// {
//   apiKey: "AIzaSyA-8selVEAoBrhxuJzWwBAvvh30VdKJNTA",
//   authDomain: "social-media-b2678.firebaseapp.com",
//   databaseURL: "https://social-media-b2678.firebaseio.com",
//   projectId: "social-media-b2678",
//   storageBucket: "social-media-b2678.appspot.com",
//   messagingSenderId: "12242023192",
//   appId: "1:12242023192:web:e2ceb666e16ad9963e246d",
// };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
