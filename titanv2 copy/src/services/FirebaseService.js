import { auth, db } from 'auth/FirebaseAuth';

const FirebaseService = {}

FirebaseService.fetchUserInfo = async (uid) => {
  const userRef = db.collection('users').doc(uid);
  return await userRef.get().then(userInfo => {
    if (userInfo.exists) {
      return {
        ...userInfo.data()
      }
    } else {
      return { message: "The user doesn't exist in DB" }
    }
  })
}

FirebaseService.signInEmailRequest = async (email, password) => {
  const userCredential = await auth.signInWithEmailAndPassword(email, password).then(user => user).catch(err => err);
  if (userCredential.message) return userCredential;
  const idToken = await auth.currentUser.getIdToken(true).then(token => token);
  const user = userCredential.user;
  const userRef = db.collection('users').doc(user.uid);
  return await userRef.get().then(docSnapshot => {
    if (docSnapshot.exists) {
      return {
        ...docSnapshot.data(),
        idToken
      }
    } else {
      return { message: "The user doesn't exist in DB" }
    }
  });
}

FirebaseService.signOutRequest = async () =>
  await auth.signOut().then(userCredential => userCredential).catch(err => err);

FirebaseService.signUpEmailRequest = async (name, email, password) => {
  return await auth
    .createUserWithEmailAndPassword(email, password)
    .then(async userCredential => {
      const idToken = await userCredential.user.getIdToken(true).then();
      const userInfo = {
        name,
        email,
        uid: userCredential.user.uid,
      }
      await db.collection('users').doc(userCredential.user.uid).set(userInfo).then();
      return {
        ...userInfo,
        idToken
      }
    })
    .catch(err => err);
}

export default FirebaseService