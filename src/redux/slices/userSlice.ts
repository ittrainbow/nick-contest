import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IUser } from '../../types'
import { initialUser } from '../../helpers'

const initialState = initialUser

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      const { admin, name, buddies } = action.payload
      state.admin = admin
      state.name = name
      state.buddies = buddies
    },

    updateUser(state, action: PayloadAction<{ [key: string]: string }>) {
      const { name } = action.payload
      state.name = name
    },
    
    setUid(state, action: PayloadAction<string>) {
      state.uid = action.payload
    },

    setBuddies(state, action: PayloadAction<string[]>) {
      state.buddies = action.payload
    },

    clearUser() {
      return initialState
    }
  }
})

export const userActions = userSlice.actions
