import { getDoc, setDoc, doc } from 'firebase/firestore'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential
} from 'firebase/auth'

import { i18n, LocaleType } from '../locale'
import { appActions } from '../redux/slices'
import { db, auth } from './firebase'
import { IUser } from '../types'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    appActions.setLoading(true)
    const response: UserCredential = await signInWithPopup(auth, googleProvider)
    if (response) {
      const { uid } = response.user
      const name = response.user.displayName || 'username'
      const docs = await getDoc(doc(db, 'users', uid))
      const googleAuthCreateUserInDB = async () => {
        const user = { name, admin: false, buddies: [uid] }
        await setDoc(doc(db, 'users', uid), user)
      }
      docs.data() === undefined && googleAuthCreateUserInDB()
      const user = docs.data() as IUser
      appActions.setLoading(false)
      return { user, uid }
    }
  } catch (error) {
    if (error instanceof Error) console.error(error)
  }
}

export const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    appActions.setLoading(true)
    const responseLogin: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const { uid } = responseLogin.user
    const responseUser = await getDoc(doc(db, 'users', uid))
    const user = responseUser.data() as IUser
    appActions.setLoading(false)
    return { user, uid }
  } catch (error) {
    if (error instanceof Error) {
      const { emailWrongMsg, passwordWrongMsg } = i18n('auth') as LocaleType
      if (error.message.includes('user-not-found')) {
        alert(emailWrongMsg)
      } else if (error.message.includes('wrong-password')) {
        alert(passwordWrongMsg)
      }
      console.error(error.message)
    }
  }
}

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    appActions.setLoading(true)
    const response: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { uid } = response.user
    const data: IUser = { name, admin: false, buddies: [uid] }
    await setDoc(doc(db, 'users', uid), data)
    appActions.setLoading(false)
    return { uid }
  } catch (error) {
    if (error instanceof Error) {
      const { emailExistsMsg } = i18n('auth') as LocaleType
      if (error.message.includes('email-already-in-use')) alert(emailExistsMsg)
      console.error(error)
    }
  }
}

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return alert('Password reset link sent!')
  } catch (error) {
    if (error instanceof Error) console.error(error)
  }
}

export const logout = () => {
  appActions.setLoading(true)
  signOut(auth)

  return appActions.setLoading(false)
}
