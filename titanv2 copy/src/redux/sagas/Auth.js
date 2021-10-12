import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import {
	AUTH_TOKEN,
	SIGNIN,
	SIGNOUT,
	SIGNUP,
	SET_USER,
} from '../constants/Auth';
import {
	showAuthMessage,
	authenticated,
	signOutSuccess,
	signUpSuccess,
	showLoading,
	setUserSuccess
} from "../actions/Auth";

import FirebaseService from 'services/FirebaseService'

export function* signInWithFBEmail() {
	yield takeEvery(SIGNIN, function* ({ payload }) {
		const { email, password } = payload;
		yield put(showLoading());
		try {
			const user = yield call(FirebaseService.signInEmailRequest, email, password);
			if (user.message) {
				yield put(showAuthMessage(user.message));
			} else {
				localStorage.setItem(AUTH_TOKEN, user.idToken);
				yield put(authenticated(user.idToken));
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export function* signOut() {
	yield takeEvery(SIGNOUT, function* () {
		try {
			const signOutUser = yield call(FirebaseService.signOutRequest);
			if (signOutUser === undefined) {
				localStorage.removeItem(AUTH_TOKEN);
				yield put(signOutSuccess(signOutUser));
			} else {
				yield put(showAuthMessage(signOutUser.message));
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export function* signUpWithFBEmail() {
	yield takeEvery(SIGNUP, function* ({ payload }) {
		const { name, email, password } = payload;
		try {
			yield put(showLoading());
			const user = yield call(FirebaseService.signUpEmailRequest, name, email, password);
			if (user.message) {
				yield put(showAuthMessage(user.message));
			} else {
				localStorage.setItem(AUTH_TOKEN, user.idToken);
				yield put(signUpSuccess(user.idToken));
			}
		} catch (error) {
			yield put(showAuthMessage(error));
		}
	}
	);
}

export function* setUserInfo() {
	yield takeEvery(SET_USER, function* ({ payload }) {
		const { uid } = payload;
		yield put(showLoading());
		try {
			const user = yield call(FirebaseService.fetchUserInfo, uid);
			console.log("uid-user>", user)

			if (user.message) {
				yield put(showAuthMessage(user.message));
			} else {
				yield put(setUserSuccess(user));
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export default function* rootSaga() {
	yield all([
		fork(signInWithFBEmail),
		fork(signOut),
		fork(signUpWithFBEmail),
		fork(setUserInfo)
	]);
}
