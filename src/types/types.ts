import { IAnswers, IPlayers } from '.'

export type FadeRefType = React.RefObject<HTMLDivElement>

export type QuestionType = {
  home: string
  away: string
  total: string
  id?: number | null
  deadline: number
}
export type QuestionsType = { [key: number]: QuestionType }

export type BuddiesPayloadType = {
  buddies: string[]
  buddyUid: string
}

export type TableCreatorType = {
  answers: IAnswers
  players: IPlayers
  results: AnswersType
  fullSeason: boolean
}

export type AnswersType = {
  [key: number]: {
    [key: number]: number
  }
}

export type AnswersUpdateType = {
  answers: AnswersType
  uid: string
}

export type SingleAnswerUpdateType = {
  selectedWeek: number
  id: number
  uid: string
  answer: number
}

export type SingleAnswerDeleteType = {
  selectedWeek: number
  id: number
  uid: string
}

export type SingleResultUpdateType = {
  selectedWeek: number
  id: number
  uid: string
  answer: number
}

export type SingleResultDeleteType = {
  selectedWeek: number
  id: number
  uid: string
}

export type ResultsUpdateType = {
  results: AnswersType
  selectedWeek: number
}

export type WeekType = {
  active: boolean
  name: string
  questions: QuestionsType
}

export type WeeksType = {
  [key: number]: WeekType
}

export type WeekUpdateType = {
  id: number
  week: WeekType
}

export type ActionType<T> = {
  type: string
  payload: T
}

export type YesNoHandlePropsType = {
  value: number
  id: number
  activity: number
}

export type ChangeInputType = React.ChangeEvent<HTMLInputElement>

export type InputRefType = HTMLInputElement