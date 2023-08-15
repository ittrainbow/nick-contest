import { IUserStandings, IAnswers, IPlayers, AnswersType, IWeeks } from '../types'

type TableCreatorType = {
  answers: IAnswers
  players: IPlayers
  results: AnswersType
  fullSeason: boolean
  weeks: IWeeks
}

type FetchObjectType<T> = {
  [key: number | string]: T
}

export const getTable = ({ answers, players, results, fullSeason, weeks }: TableCreatorType) => {
  const userList = Object.keys(players)
  const object: FetchObjectType<IUserStandings> = {}
  userList.forEach((el) => {
    let ansTotal = 0
    let ansCorrect = 0
    let resultsTotal = 0
    const uid = el
    const { name } = players[el]
    const lastWeek = Number(Object.keys(results).splice(-1))
    const ans = answers && answers[el] ? answers[el] : {}
    // console.log(100, weeks)
    // console.log(101, Object.keys(weeks))
    Object.keys(weeks)
      .map((el) => Number(el))
      .filter((el) => {
        return fullSeason ? el >= 0 : el === lastWeek
      })
      .forEach((el) => {
        // console.log(102, el)
        const subAns = ans ? ans[el] : null
        // console.log(103, weeks[el].questions)
        weeks[el] &&
          Object.keys(weeks[el].questions)
            .map((el) => Number(el))
            .forEach((i) => {
              const score = weeks[el].questions[i].score
              // console.log(104, score)
              const [away, home] = score.split('-').map((el) => Number(el))
              const result = away > home ? 1 : away < home ? 2 : 0
              console.log(105, score.length > 0)
              score.length > 0 && resultsTotal++
              console.log(106, resultsTotal)
              subAns && subAns[i] && ansTotal++
              subAns && subAns[i] && subAns[i] === result && ansCorrect++
            })
      })

    const correct = ansTotal ? ansCorrect / ansTotal : 0
    console.log(107, name, resultsTotal)
    object[el] = { name, uid, ansTotal, ansCorrect, resultsTotal, correct, position: '' }
  })

  const array: IUserStandings[] = Object.keys(object).map((el) => object[el])

  const table = array.sort((a: IUserStandings, b: IUserStandings) => {
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

  table.forEach((_, index) => {
    const samePosition = index > 0 && table[index].correct === table[index - 1].correct
    table[index]['position'] = samePosition ? table[index - 1].position : index + 1
  })

  return table
}

export const getTableRowParams = (el: IUserStandings) => {
  const { name, ansCorrect, ansTotal, position, resultsTotal, uid } = el
  const answers = ansCorrect + '/' + resultsTotal
  const correct = resultsTotal !== 0 ? (ansCorrect / resultsTotal).toFixed(3) : '0.000'
  const isNinety = (ansTotal * 100) / resultsTotal
  const ninety = !isNaN(isNinety) ? isNinety.toFixed(0) + '%' : '-'

  return { name, answers, correct, ninety, position, uid }
}
