import { call, put, select, takeEvery } from 'redux-saga/effects'

import { createStandingsSaga } from '.'
import { getDBCollection, getDBDocument, updateDBDocument, writeDBDocument } from '../../db'
import { getObjectsEquality } from '../../helpers'
import { concatAndrewMordenAnswers, morden } from '../../helpers/andrewMorden'
import { ActionType, AnswersType, IPlayers, IUser, IUserStore } from '../../types'
import { answersActions, appActions, compareActions, userActions } from '../slices'
import * as TYPES from '../storetypes'

type UserUpdateType = {
  locale: 'ua' | 'ru'
  name: string
  uid: string
}

type BuddiesPayloadType = {
  buddies: string[]
  buddyUid: string
}

type SubmitAnswersType = {
  selectedWeek: number
  answers: { [key: string]: AnswersType }
  uid: string
  toaster: (value: boolean) => void
  firstData: boolean
}

function* updateProfileSaga(action: ActionType<UserUpdateType>) {
  yield put(appActions.setLoading(true))

  const { payload } = action
  const { uid, name, locale } = payload

  try {
    const response: IUser = yield call(getDBDocument, 'users', uid)
    const data = { ...response, name, locale }
    yield call(writeDBDocument, 'users', uid, data)
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }

  yield put(appActions.setLoading(false))
}

type UserLoginType = {
  user: {
    uid: string
    displayName: string
  }
  emailReg: boolean
}

function* userLoginSaga(action: ActionType<UserLoginType>) {
  const { user, emailReg } = action.payload
  const { uid, displayName } = user
  try {
    const responseUser: IUser | undefined = yield call(getDBDocument, 'users', uid)
    const user: IUser = responseUser || {
      name: displayName,
      admin: false,
      buddies: [uid]
    }

    const answers: AnswersType = yield call(getDBDocument, 'answers', uid)

    if (!responseUser || emailReg) {
      const players: IPlayers = yield call(getDBCollection, 'users')
      players[uid] = user
      yield call(createStandingsSaga, players)
    }

    const gotOnRegister: string = yield select((store) => store.user.name)

    if (!gotOnRegister) {
      yield put(userActions.setUser(user))
    }

    yield put(compareActions.setCompare(answers))
    yield put(answersActions.updateAnswers({ answers, uid }))
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
}

function* submitAnswersSaga(action: ActionType<SubmitAnswersType>) {
  const { answers, uid, toaster, selectedWeek, firstData } = action.payload

  yield put(appActions.setLoading(true))
  try {
    if (firstData) {
      yield call(writeDBDocument, 'answers', uid, answers[uid])
    } else {
      yield call(updateDBDocument, 'answers', uid, selectedWeek, answers)
    }

    const response: AnswersType = yield call(getDBDocument, 'answers', uid)
    yield put(compareActions.setCompare(answers[uid]))

    const saveSuccess: boolean = yield call(getObjectsEquality, response, answers[uid])
    yield call(toaster, saveSuccess)
  } catch (error) {
    yield toaster(false)
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
  const players: IPlayers = yield call(getDBCollection, 'users')
  yield call(createStandingsSaga, players)
  yield put(appActions.setLoading(false))
}

function* fetchOtherUserSaga(action: ActionType<string>) {
  const uid = action.payload
  try {
    const otherUserAnswers: AnswersType = yield select((store) => store.answers[uid])
    if (!otherUserAnswers) {
      const isMorden = morden.includes(uid)
      const responseOne: AnswersType = yield call(getDBDocument, 'answers', uid)
      let responseTwo: AnswersType = {}

      if (isMorden) {
        const otherMorden = morden.filter((id) => id !== uid)[0]
        responseTwo = yield call(getDBDocument, 'answers', otherMorden)
      }

      const answers = concatAndrewMordenAnswers(responseOne, responseTwo)
      yield put(answersActions.updateAnswers({ answers, uid }))
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
}

function* setBuddiesSaga(action: ActionType<BuddiesPayloadType>) {
  const user: IUserStore = yield select((store) => store.user)
  const { buddyUid, buddies } = action.payload
  const { uid, ...newUser } = user
  const newBuddies = buddies.includes(buddyUid) ? buddies.filter((el) => el !== buddyUid) : [...buddies, buddyUid]
  newUser.buddies = newBuddies

  try {
    yield put(userActions.setBuddies(newBuddies))
    yield call(writeDBDocument, 'users', user.uid, newUser)
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
}

export function* userSaga() {
  yield takeEvery(TYPES.UPDATE_PROFILE, updateProfileSaga)
  yield takeEvery(TYPES.USER_LOGIN, userLoginSaga)
  yield takeEvery(TYPES.SUBMIT_ANSWERS, submitAnswersSaga)
  yield takeEvery(TYPES.FETCH_OTHER_USER, fetchOtherUserSaga)
  yield takeEvery(TYPES.SET_BUDDIES, setBuddiesSaga)
}
