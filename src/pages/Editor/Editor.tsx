import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmAlert } from 'react-confirm-alert'
import { useNavigate } from 'react-router-dom'

import 'react-confirm-alert/src/react-confirm-alert.css'

import { selectApp, selectEditor, selectLocation, selectWeeks } from '../../redux/selectors'
import { appActions, editorActions, weeksActions } from '../../redux/slices'
import { getObjectsEquality, getWeeksIDs } from '../../helpers'
import { EditorInputs, EditorQuestion } from '.'
import * as TYPES from '../../redux/storetypes'
import { i18n, LocaleType } from '../../locale'
import { ChangeInputType } from '../../types'
import { Button, Input } from '../../UI'
import { useFade } from '../../hooks'

export const Editor = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const weeks = useSelector(selectWeeks)
  const editor = useSelector(selectEditor)
  const { selectedWeek, emptyEditor } = useSelector(selectApp)
  const { pathname } = useSelector(selectLocation)
  const { tabActive, duration } = useSelector(selectApp)
  const { questions, name, active } = editor
  const questionsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [anyChanges, setAnyChanges] = useState<boolean>(false)

  // container fade animations

  const { triggerFade } = useFade({ ref: containerRef })

  useEffect(() => {
    const fromUserTabsToEmpty = !pathname.includes('editor') && tabActive === 6
    const fromListToEmpty = pathname.includes('editor/') && tabActive !== 5
    const conditions = tabActive < 5 || fromUserTabsToEmpty || fromListToEmpty

    conditions && triggerFade()
    // eslint-disable-next-line
  }, [tabActive])

  // helpers

  useEffect(() => {
    const changes = emptyEditor ? !!Object.keys(questions).length : !getObjectsEquality(editor, weeks[selectedWeek])
    setAnyChanges(changes)
    // eslint-disable-next-line
  }, [questions, name, active])

  useEffect(() => {
    if (tabActive === 6) {
      dispatch(editorActions.clearQuestionInWork())
      setTimeout(() => dispatch(editorActions.clearEditor()), duration)
    }
    // eslint-disable-next-line
  }, [tabActive])

  const saveBtnDisabled = !anyChanges || !name || !Object.keys(questions).length

  // action handlers

  const handleSubmit = async () => {
    const id = selectedWeek
    const { active, name, questions } = editor
    dispatch({ type: TYPES.SUBMIT_WEEK, payload: { id, week: { active, name, questions } } })
    dispatch(appActions.setNextAndCurrentWeeks(getWeeksIDs(weeks)))
    dispatch(weeksActions.updateWeeks({ week: editor, id }))
    dispatch(appActions.setSelectedWeek(selectedWeek ? selectedWeek + 1 : 0))
    navigate('/calendar')
  }

  const handleDeleteWeek = () => {
    const deleter = async () => {
      const newWeeks = structuredClone(weeks)
      delete newWeeks[selectedWeek]
      dispatch({ type: TYPES.DELETE_WEEK, payload: selectedWeek })
      dispatch(weeksActions.setWeeks(newWeeks))
      dispatch(appActions.setNextAndCurrentWeeks(getWeeksIDs(weeks)))
      navigate('/calendar')
    }

    confirmAlert({
      message: weekDeleteMsg,
      buttons: [{ label: buttonDeleteYesMsg, onClick: async () => deleter() }, { label: buttonDeleteNoMsg }]
    })
  }

  const handleCancelEditor = () => {
    dispatch(appActions.setEmptyEditor(false))
    dispatch(appActions.setTabActive(5))
    triggerFade()
    setTimeout(() => {
      dispatch(editorActions.clearEditor())
      navigate('/calendar')
    }, duration)
  }

  const handleChangeActivity = (e: ChangeInputType) => {
    const { checked } = e.target
    dispatch(editorActions.updateEditorActive(checked))
  }

  // render styles and locales

  const { weekDeleteMsg, weekActivityMsg } = i18n('editor') as LocaleType
  const { buttonSaveMsg, buttonCancelMsg, buttonDeleteWeekMsg, buttonDeleteYesMsg, buttonDeleteNoMsg } = i18n(
    'buttons'
  ) as LocaleType

  return (
    <div className="container animate-fade-in-up" ref={containerRef}>
      <EditorInputs questionsRef={questionsRef} />

      <div className="animate-fade-in-up" ref={questionsRef}>
        {Object.keys(questions)
          .sort((a: string, b: string) => {
            return questions[Number(a)].deadline - questions[Number(b)].deadline
          })
          .map((el) => (
            <EditorQuestion key={Math.random()} id={Number(el)} questionsRef={questionsRef} />
          ))}
        <hr />
        <div className="editor-bottom">
          <div className="editor-checkbox">
            <div className="editor-checkbox__pad">{weekActivityMsg}</div>
            <Input
              type="checkbox"
              checked={active}
              className={'editor-checkbox__box'}
              onChange={handleChangeActivity}
            />
          </div>
          <Button disabled={saveBtnDisabled} onClick={handleSubmit}>
            {buttonSaveMsg}
          </Button>
          <Button onClick={handleCancelEditor}>{buttonCancelMsg}</Button>
          {pathname.includes('editor/') && <Button onClick={handleDeleteWeek}>{buttonDeleteWeekMsg}</Button>}
        </div>
      </div>
    </div>
  )
}
