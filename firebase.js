import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBG8oXePNk0nYkk780WgKyf8YYYwrnCulk",
  authDomain: "project-7312a.firebaseapp.com",
  projectId: "project-7312a",
  storageBucket: "project-7312a.appspot.com",
  messagingSenderId: "762429711240",
  appId: "1:762429711240:web:50af3208a000901632d03d",
  measurementId: "G-9EJNHZD395"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;