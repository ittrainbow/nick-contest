import { all, call, put, take } from 'redux-saga/effects'

import { createStandingsSaga } from '.'
import { getDBCollection } from '../../db'
import { getWeeksIDs } from '../../helpers'
import { IAbout, IPlayers, IWeeks } from '../../types'
import { aboutActions, appActions, weeksActions } from '../slices'
import { INIT_APP } from '../storetypes'

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
    const weeksFetched: IWeeks = yield call(getDBCollection, 'weeks')
    const weeks: IWeeks = Object.fromEntries(Object.entries(weeksFetched).filter(([key]) => parseInt(key) > 35))
    // const weeks: IWeeks = Object.fromEntries(Object.entries(weeksFetched))
    // console.log(123, weeks2)
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
