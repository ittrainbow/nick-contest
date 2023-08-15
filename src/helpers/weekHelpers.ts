import moment from 'moment/moment'

import { WeeksType, IAnswers, AnswersType } from '../types'

export const getWeeksIDs = (weeks: WeeksType) => {
  const arr = Object.keys(weeks).map((el) => Number(el))
  const currentWeek = arr
    .filter((el) => weeks[el].active)
    .map((el) => Number(el))
    .sort((a, b) => b - a)[0]

  const nextWeek = arr.map((el) => Number(el)).sort((a, b) => b - a)[0] + 1 || 0
  return { currentWeek, nextWeek }
}

export const getAnswersResults = (
  answers: IAnswers,
  results: AnswersType,
  selectedWeek: number,
  uid: string,
  id: number
) => {
  const res = results[selectedWeek] ? results[selectedWeek][id] : 0
  const answer = answers[uid] && answers[uid][selectedWeek] ? answers[uid][selectedWeek][id] : 0
  return { answer, res }
}

export const getDeadline = (deadline: number) =>
  moment(deadline)
    .format()
    .substring(4, 16)
    .split('T')
    .join(' ')
    .replace('-01-', ' Jan ')
    .replace('-02-', ' Feb ')
    .replace('-03-', ' Mar ')
    .replace('-04-', ' Apr ')
    .replace('-05-', ' May ')
    .replace('-06-', ' Jun ')
    .replace('-07-', ' Jul ')
    .replace('-08-', ' Aug ')
    .replace('-09-', ' Sep ')
    .replace('-10-', ' Oct ')
    .replace('-11-', ' Nov ')
    .replace('-12-', ' Dec ')
