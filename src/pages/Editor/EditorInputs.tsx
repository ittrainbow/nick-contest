import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaCheck, FaPlus } from 'react-icons/fa'
import moment from 'moment/moment'

import { selectApp, selectEditor, selectLocation } from '../../redux/selectors'
import { ChangeInputType, FadeRefType, QuestionsType } from '../../types'
import { getNewQuestionId, getObjectsEquality } from '../../helpers'
import { editorActions } from '../../redux/slices'
import { i18n, LocaleType } from '../../locale'
import { Input, Button } from '../../UI'
import { useFade } from '../../hooks'

export const EditorInputs = ({ questionsRef }: { questionsRef: FadeRefType }) => {
  const dispatch = useDispatch()
  const nameRef = useRef<HTMLInputElement>()
  const questionRef = useRef<HTMLInputElement>()
  const { duration, tabActive } = useSelector(selectApp)
  const editor = useSelector(selectEditor)
  const { pathname } = useSelector(selectLocation)
  const { name, questionInWork, questionCompare } = editor
  const { home, away, total, id, deadline } = questionInWork

  // animate

  const { triggerFade } = useFade({ ref: questionsRef })

  // helpers

  useEffect(() => {
    pathname.includes('/editor/') && tabActive === 5 && nameRef.current?.focus()
    // eslint-disable-next-line
  }, [pathname])

  useEffect(() => {
    questionInWork.id !== null && questionRef.current?.focus()
  }, [questionInWork])

  const getDeadline = (deadline: number) => {
    return moment(deadline || new Date().getTime())
      .format()
      .substring(0, 16)
  }

  const questionButtonDisabled = getObjectsEquality(questionInWork, questionCompare)
  const totalBtnDisabled = !home || !away || !total || questionButtonDisabled

  // action handlers

  const handleChangeName = (e: ChangeInputType) => {
    const { value } = e.target
    dispatch(editorActions.updateEditorName(value))
  }

  const handleSetAway = (e: ChangeInputType) => {
    const { value } = e.target
    const away = value.substring(0, 120)
    const data = { ...questionInWork, away }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleSetHome = (e: ChangeInputType) => {
    const { value } = e.target
    const home = value.substring(0, 120)
    const data = { ...questionInWork, home }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleChangeDate = (e: ChangeInputType) => {
    const { value } = e.target
    const deadline = new Date(value).getTime()
    const data = { ...questionInWork, deadline }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleAddQuestion = () => {
    const { home, away } = questionInWork
    const { questions } = editor
    const { id, deadline } = questionInWork
    if (!!home.length && !!away.length) {
      triggerFade()
      setTimeout(() => {
        const setId = id === null ? getNewQuestionId(questions) : (id as number)
        const obj: QuestionsType = structuredClone(questions)
        obj[setId] = questionInWork
        dispatch(editorActions.clearQuestionInWorkWithDeadline(deadline))
        dispatch(editorActions.updateEditorQuestions(obj))
      }, duration)
    }
  }

  // render styles and locales

  const { weekNameMsg, weekAwayMsg, weekHomeMsg } = i18n('editor') as LocaleType

  return (
    <div className="editor-input">
      <Input onChange={handleChangeName} inputRef={nameRef} placeholder={weekNameMsg} value={name} />
      <div className="editor-form">
        <Input inputRef={questionRef} onChange={handleSetAway} placeholder={weekAwayMsg} value={away} />
        <Input inputRef={questionRef} onChange={handleSetHome} placeholder={weekHomeMsg} value={home} />
      </div>
      <div className="editor-form">
        <div className="editor-datetime">
          <Input
            type="datetime-local"
            value={getDeadline(deadline)}
            className={'timer'}
            onChange={handleChangeDate}
          />
        </div>
        <Button className="editor-small" onClick={handleAddQuestion} disabled={totalBtnDisabled}>
          {id !== null ? <FaCheck /> : <FaPlus />}
        </Button>
      </div>
    </div>
  )
}
