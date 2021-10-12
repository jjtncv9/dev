import {
  AUTH_TOKEN,
  AUTHENTICATED,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SHOW_LOADING,
  SET_USER_SUCCESS,
  SET_USER
} from '../constants/Auth';

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  token: localStorage.getItem(AUTH_TOKEN),
  user: null
}

const auth = (state = initState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        loading: false,
        showMessage: false,
        message: "",
        redirect: '/',
        token: action.token
      }
    case SHOW_AUTH_MESSAGE:
      return {
        ...state,
        message: action.message,
        showMessage: true,
        loading: false
      }
    case HIDE_AUTH_MESSAGE:
      return {
        ...state,
        message: '',
        showMessage: false,
      }
    case SIGNOUT_SUCCESS: {
      return {
        ...state,
        token: null,
        redirect: '/',
        loading: false
      }
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        message: '',
        showMessage: false,
        token: action.token
      }
    }
    case SHOW_LOADING: {
      return {
        ...state,
        loading: true
      }
    }
    case SET_USER_SUCCESS: {
      return {
        ...state,
        user: action.user
      }
    }
    default:
      return state;
  }
}

export default auth