import { select, put, call } from 'redux-saga/effects'

import { IUserStandings, IAnswers, IPlayers, IWeeks } from '../../types'
import { standingsActions } from '../slices'
import { getDBCollection } from '../../db'
import { selectWeeks } from '../selectors'
import { getTable } from '../../helpers'

import { getAndrewMordenAnswers, trimAndrewMordenAccounts } from '../../helpers/andrewMorden'

export function* createStandingsSaga(playersPayload: IPlayers) {
  const weeks: IWeeks = yield select(selectWeeks)
  const answersPayload: IAnswers = yield call(getDBCollection, 'answers')

  const answers = getAndrewMordenAnswers(answersPayload)
  const players = trimAndrewMordenAccounts(playersPayload)

  const seasonArray: IUserStandings[] = getTable({ answers, players, fullSeason: true, weeks })
  const weekArray: IUserStandings[] = getTable({ answers, players, fullSeason: false, weeks })
  const season = Object.assign({}, seasonArray)
  const week = Object.assign({}, weekArray)

  yield put(standingsActions.setStandings({ season, week }))
}
