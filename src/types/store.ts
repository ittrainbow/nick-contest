import { IAbout, IApp, IUserStore, IAnswers, AnswersType, IWeeks, IUserStandings, ITools, IEditor } from '.'

interface IStandings {
  [key: string]: IUserStandings[]
}

interface IRouter {
  location: {
    pathname: string
    search: string
    hash: string
    state: string | null
    key: string
  }
  action: 'PUSH' | 'PULL'
}

export interface IStore {
  app: IApp
  about: IAbout
  standings: IStandings
  user: IUserStore
  answers: IAnswers
  weeks: IWeeks
  compare: IAnswers
  editor: IEditor
  router: IRouter
  tools: ITools
}
