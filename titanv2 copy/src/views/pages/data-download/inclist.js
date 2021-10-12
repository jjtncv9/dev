import {firebase} from '../../../auth/FirebaseAuth'

firebase.firestore().collection("ycVf4B0FNOMekJKEpzV4dhcl2WJ3").get().then((snapshot) => {
    console.log(snapshot.docs);
})