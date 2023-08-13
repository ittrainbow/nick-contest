import { IUserStore, WeekType, QuestionType } from '../types'

export const initialUser: IUserStore = {
  name: '',
  admin: false,
  buddies: [],
  uid: ''
}

export const initialRedirects = ['/', '/userpage', '/week', 'season', '/standings', '/calendar', '/editor']

export const emptyWeek: WeekType = {
  questions: {},
  name: '',
  active: false
}

export const emptyQuestion: QuestionType = {
  home: '',
  away: '',
  total: '1',
  id: null,
  deadline: new Date().getTime()
}
