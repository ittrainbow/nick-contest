import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AnswersType } from '../../types'

const initialState = {} as AnswersType

export const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    setCompare(_, action: PayloadAction<AnswersType>) {
      return action.payload
    },

    clearCompare() {
      return initialState
    }
  }
})

export const compareActions = compareSlice.actions
