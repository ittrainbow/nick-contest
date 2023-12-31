import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IApp } from '../../types'

type SetStandingsType = {
  otherUserUID: string
  otherUserName: string
}

const initialState: IApp = {
  mobile: false,
  loading: true,
  editor: false,
  error: '',
  currentWeek: 0,
  emptyEditor: false,
  isItYou: true,
  nextWeek: 0,
  otherUserName: '',
  otherUserUID: '',
  selectedWeek: 0,
  tabActive: 1,
  emailReg: false,
  duration: 150
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },

    setMobile(state, action: PayloadAction<boolean>) {
      state.mobile = action.payload
    },

    setEditor(state, action: PayloadAction<boolean>) {
      state.editor = action.payload
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },

    setEmailReg(state, action: PayloadAction<boolean>) {
      state.emailReg = action.payload
    },

    setEmptyEditor(state, action: PayloadAction<boolean>) {
      state.emptyEditor = action.payload
    },

    setIsItYou(state, action: PayloadAction<boolean>) {
      state.isItYou = action.payload
    },

    clearOtherUser(state) {
      state.otherUserName = ''
      state.otherUserUID = ''
    },

    setSelectedWeek(state, action: PayloadAction<number>) {
      state.selectedWeek = action.payload
    },

    setNextAndCurrentWeeks(state, action: PayloadAction<{ [key: string]: number }>) {
      state.nextWeek = action.payload.nextWeek
      state.currentWeek = action.payload.currentWeek
    },

    setTabActive(state, action: PayloadAction<number>) {
      const id = action.payload
      localStorage.setItem('contestLastTab', id.toString())
      state.tabActive = id
    },

    setOtherUserFromStandings(state, action: PayloadAction<SetStandingsType>) {
      const { otherUserName, otherUserUID } = action.payload
      state.otherUserName = otherUserName
      state.otherUserUID = otherUserUID
      state.isItYou = false
      state.tabActive = 2
    }
  }
})

export const appActions = appSlice.actions
