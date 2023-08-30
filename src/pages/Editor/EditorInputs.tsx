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
  const { home, away, total, id, deadline, score } = questionInWork

  // animate

  const { triggerFade } = useFade({ ref: questionsRef })

  // helpers

  useEffect(() => {
    pathname.includes('/editor/') && tabActive === 5 && nameRef.current?.focus()
    // eslint-disable-next-line
  }, [pathname])

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
    const { value: away } = e.target
    const data = { ...questionInWork, away }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleSetHome = (e: ChangeInputType) => {
    const { value: home } = e.target
    const data = { ...questionInWork, home }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleSetScore = (e: ChangeInputType) => {
    const { value: score } = e.target
    const data = { ...questionInWork, score }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleChangeDate = (e: ChangeInputType) => {
    const { value } = e.target
    const deadline = new Date(value).getTime()
    const data = { ...questionInWork, deadline }

    dispatch(editorActions.setQuestionInWork(data))
  }

  const handleAddQuestion = () => {
    const { home, away, id, deadline } = questionInWork
    const { questions } = editor
    if (!!home.length && !!away.length) {
      triggerFade()
      setTimeout(() => {
        const questionToWrite = { ...questionInWork }
        delete questionToWrite.id
        const setId = id === (null || undefined) ? getNewQuestionId(questions) : (id as number)
        const obj: QuestionsType = structuredClone(questions)
        obj[setId] = questionToWrite
        dispatch(editorActions.clearQuestionInWorkWithDeadline(deadline))
        dispatch(editorActions.updateEditorQuestions(obj))
      }, duration)
    }
  }

  // render styles and locales

  const { weekNameMsg, weekAwayMsg, weekHomeMsg, weekScoreMsg } = i18n('editor') as LocaleType

  return (
    <div className="editor-input">
      <Input onChange={handleChangeName} inputRef={nameRef} placeholder={weekNameMsg} value={name} />
      <div className="editor-form">
        <Input inputRef={questionRef} onChange={handleSetAway} placeholder={weekAwayMsg} value={away} />
        <Input inputRef={questionRef} onChange={handleSetHome} placeholder={weekHomeMsg} value={home} />
        <Input inputRef={questionRef} onChange={handleSetScore} placeholder={weekScoreMsg} value={score} />
      </div>
      <div className="editor-form">
        <div className="editor-datetime">
          <Input type="datetime-local" value={getDeadline(deadline)} className={'timer'} onChange={handleChangeDate} />
        </div>
        <Button className="editor-small" onClick={handleAddQuestion} disabled={totalBtnDisabled}>
          {id !== null ? <FaCheck /> : <FaPlus />}
        </Button>
      </div>
    </div>
  )
}
