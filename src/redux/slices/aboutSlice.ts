import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IAbout } from '../../types'

type AboutLocaleType = { [key: string]: string }

const initialState: IAbout = {
  en: {} as AboutLocaleType
}

export const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    setAbout(state, action: PayloadAction<IAbout>) {
      const { en } = action.payload
      state.en = en
    }
  }
})

export const aboutActions = aboutSlice.actions
