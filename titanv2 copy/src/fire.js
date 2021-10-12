import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyCgDzNM108qb5xGOObugnh7DSTmox6PxLI",
    authDomain: "ridsi-13389.firebaseapp.com",
    databaseURL: "https://ridsi-13389-default-rtdb.firebaseio.com",
    projectId: "ridsi-13389",
    storageBucket: "ridsi-13389.appspot.com",
    messagingSenderId: "1077534661299",
    appId: "1:1077534661299:web:e9748ad5a37eab324aeec6",
    measurementId: "G-3RXHW9CLZ9"
  };

//   var fire = firebase.initializeApp(firebaseConfig)
  if (!firebase.apps.length) {
    var fire = firebase.initializeApp(firebaseConfig)
 } else {
    firebase.app()
 }
  export default fire;