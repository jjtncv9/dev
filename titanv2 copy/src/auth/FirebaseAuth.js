import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import FirebaseConfig from 'configs/FirebaseConfig';

firebase.initializeApp(FirebaseConfig);

// firebase utils
// const rdb = firebase.database()
const db = firebase.firestore()
const auth = firebase.auth();
const currentUser = auth.currentUser

export {
	db,
	auth,
	currentUser,
	firebase
};