import { IAnswers, IPlayers, IUserStandings, IWeeks } from '../types'
import { getResultFromScore } from './scoresHelpers'

type TableCreatorType = {
  answers: IAnswers
  players: IPlayers
  fullSeason: boolean
  weeks: IWeeks
}

type FetchObjectType<T> = {
  [key: number | string]: T
}

export const getTable = ({ answers, players, fullSeason, weeks }: TableCreatorType) => {
  const userList = Object.keys(players)
  const object: FetchObjectType<IUserStandings> = {}
  userList.forEach((el) => {
    let ansTotal = 0
    let ansCorrect = 0
    let resultsTotal = 0
    const uid = el
    const { name } = players[el]
    const lastWeek = Number(
      Object.keys(weeks)
        .filter((week) => weeks[Number(week)].active)
        .splice(-1)
    )
    const ans = answers && answers[el] ? answers[el] : {}
    Object.keys(weeks)
      .map((el) => Number(el))
      .filter((el) => (fullSeason ? el >= 0 : el === lastWeek))
      .forEach((el) => {
        const subAns = ans ? ans[el] : null
        weeks[el] &&
          Object.keys(weeks[el].questions)
            .map((el) => Number(el))
            .forEach((i) => {
              const { score } = weeks[el].questions[i]
              const result = getResultFromScore(score.trim())
              !!score.length && result > 0 && resultsTotal++
              subAns &&
                subAns[i] &&
                // && !!score.length
                ansTotal++
              subAns && subAns[i] && subAns[i] === result && ansCorrect++
            })
      })

    const correct = ansTotal ? ansCorrect / ansTotal : 0
    object[el] = { name, uid, ansTotal, ansCorrect, resultsTotal, correct, position: '' }
  })

  const array: IUserStandings[] = Object.keys(object).map((el) => object[el])

  const table = array
    .sort((a: IUserStandings, b: IUserStandings) => {
      return a.ansCorrect < b.ansCorrect
        ? 1
        : a.ansCorrect > b.ansCorrect
        ? -1
        : a.correct < b.correct
        ? 1
        : a.correct > b.correct
        ? -1
        : 0
    })
    .filter((row) => row.ansTotal > 0)

  table.forEach((_, index) => {
    const samePosition = index > 0 && table[index].correct === table[index - 1].correct
    table[index]['position'] = samePosition ? table[index - 1].position : index + 1
  })

  return table
}

export const getTableRowParams = (el: IUserStandings) => {
  const { name, ansCorrect, ansTotal, position, resultsTotal, uid } = el
  const userAnswers = ansCorrect + '/' + ansTotal
  const correct = resultsTotal !== 0 && ansTotal > 0 ? (ansCorrect / ansTotal).toFixed(3) : '0.000'

  return { name, userAnswers, correct, position, uid }
}
