import { take, all, call, put } from 'redux-saga/effects'

import { appActions, aboutActions, weeksActions } from '../slices'
import { IAbout, IWeeks, IPlayers } from '../../types'
import { getWeeksIDs } from '../../helpers'
import { getDBCollection } from '../../db'
import { INIT_APP } from '../storetypes'
import { createStandingsSaga } from '.'

function* fetchAboutSaga() {
  try {
    const about: IAbout = yield call(getDBCollection, 'about')
    yield put(aboutActions.setAbout(about))
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
}

function* fetchWeeksSaga() {
  try {
    const weeks: IWeeks = yield call(getDBCollection, 'weeks')
    const { currentWeek, nextWeek } = getWeeksIDs(weeks)
    yield put(appActions.setSelectedWeek(currentWeek))
    yield put(weeksActions.setWeeks(weeks))
    yield put(appActions.setNextAndCurrentWeeks({ currentWeek, nextWeek }))
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
}

export function* fetchStandingsSaga() {
  try {
    const players: IPlayers = yield call(getDBCollection, 'users')
    yield call(createStandingsSaga, players)
  } catch (error) {
    if (error instanceof Error) {
      yield put(appActions.setError(error.message))
    }
  }
}

export function* initSaga() {
  while (true) {
    yield take(INIT_APP)
    yield put(appActions.setLoading(true))
    yield all([fetchAboutSaga(), fetchWeeksSaga()])
    yield call(fetchStandingsSaga)
    yield put(appActions.setLoading(false))
  }
}
