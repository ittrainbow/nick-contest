import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IEditor, QuestionType, QuestionsType, WeekType } from '../../types'
import { emptyQuestion } from '../../helpers'

const initialState: IEditor = {
  questions: {},
  name: '',
  active: false,
  questionInWork: emptyQuestion,
  questionCompare: {} as QuestionType
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorState(state, action: PayloadAction<WeekType>) {
      const { questions, name, active } = action.payload
      state.questions = questions
      state.name = name
      state.active = active
    },

    updateEditorQuestions(state, action: PayloadAction<QuestionsType>) {
      state.questions = action.payload
    },

    updateEditorName(state, action: PayloadAction<string>) {
      state.name = action.payload
    },

    updateEditorActive(state, action: PayloadAction<boolean>) {
      state.active = action.payload
    },

    setQuestionInWork(state, action: PayloadAction<QuestionType>) {
      state.questionInWork = action.payload
    },

    setQuestionCompare(state, action: PayloadAction<QuestionType>) {
      state.questionCompare = action.payload
    },

    clearQuestionInWork(state) {
      state.questionInWork = emptyQuestion
    },

    clearQuestionInWorkWithDeadline(state, action: PayloadAction<number>) {
      state.questionInWork = { ...emptyQuestion, deadline: action.payload }
    },

    clearEditor() {
      return initialState
    }
  }
})

export const editorActions = editorSlice.actions
