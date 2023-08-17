export type QuestionType = {
  home: string
  away: string
  total: string
  id?: number | null
  deadline: number
  score: string
}

export type AnswersType = {
  [key: number]: {
    [key: number]: number
  }
}

export type WeekType = {
  active: boolean
  name: string
  questions: QuestionsType
}

export type WeeksType = {
  [key: number]: WeekType
}

export type ActionType<T> = {
  type: string
  payload: T
}

export type ChangeInputType = React.ChangeEvent<HTMLInputElement>

export type QuestionsType = { [key: number]: QuestionType }

export type FadeRefType = React.RefObject<HTMLDivElement>
