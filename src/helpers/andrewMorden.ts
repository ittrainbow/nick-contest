import { AnswersType, IAnswers, IPlayers } from '../types'

export const morden = ['vkDQ7aYqO8bhngJ5ywTyH4zDlpJ3', 'rM1llvZF0WOMxfzQ8CdfO3y4sYF2']

type UniquesType = AnswersType | { [key: number]: number }

export const getUniques = (ans0: UniquesType = {}, ans1: UniquesType = {}) => {
  const result = Object.keys(ans0)
    .concat(Object.keys(ans1))
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((el) => Number(el))
    .sort((a, b) => a - b)

  return result
}

export const concatAndrewMordenAnswers = (ans0: AnswersType, ans1: AnswersType) => {
  let result: AnswersType = {}
  const weeksAnsweredByMorden = getUniques(ans0, ans1)

  weeksAnsweredByMorden.forEach((week: number) => {
    result[week] = {}
    const selectedWeekAnswersByMorden = getUniques(ans0[week], ans1[week])
    selectedWeekAnswersByMorden.forEach((answer) => {
      if (ans0[week] && ans0[week][answer]) {
        result[week][answer] = ans0[week][answer]
      } else {
        result[week][answer] = ans1[week][answer]
      }
    })
  })

  return result
}

export const getAndrewMordenAnswers = (answers: IAnswers) => {
  const [ans0, ans1] = [answers[morden[0]], answers[morden[1]]]
  const result = concatAndrewMordenAnswers(ans0, ans1)
  answers[morden[0]] = result
  delete answers[morden[1]]

  return answers
}

export const trimAndrewMordenAccounts = (playersPayload: IPlayers) => {
  delete playersPayload[morden[1]]

  return playersPayload
}
