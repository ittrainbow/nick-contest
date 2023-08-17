import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { selectAnswers, selectApp, selectCompare, selectLocation, selectUser, selectWeeks } from '../../redux/selectors'
import { answersActions } from '../../redux/slices'
import { useChanges, useFade } from '../../hooks'
import * as TYPES from '../../redux/storetypes'
import { i18n, LocaleType } from '../../locale'
import { OtherUser, Button } from '../../UI'
import { WeekType } from '../../types'
import { WeekQuestion } from '.'

export const Week = () => {
  const dispatch = useDispatch()
  const { selectedWeek, currentWeek, isItYou, duration, tabActive } = useSelector(selectApp)
  const { uid } = useSelector(selectUser)
  const { pathname } = useSelector(selectLocation)
  const answers = useSelector(selectAnswers)
  const weeks = useSelector(selectWeeks)
  const compare = useSelector(selectCompare)
  const containerRef = useRef<HTMLDivElement>(null)
  const { name, questions } = weeks[selectedWeek] || ({} as WeekType)

  const gotChanges = useChanges()

  // container fade animations

  const { triggerFade } = useFade({ ref: containerRef })

  useEffect(() => {
    const fromSeasonList = pathname.includes('week/') && tabActive !== 3
    const fromCurrentWeek = !pathname.includes('week/') && tabActive !== 2
    if (fromSeasonList || fromCurrentWeek) triggerFade()
    // eslint-disable-next-line
  }, [tabActive, triggerFade])

  // action handlers

  const handleSubmit = async () => {
    const firstData = !!Object.keys(answers[uid]).length
    const toastSuccess = () => toast.success(successMsg)
    const toastFailure = () => toast.error(failureMsg)
    const toaster = (success: boolean) => (success ? toastSuccess() : toastFailure())

    dispatch({ type: TYPES.SUBMIT_ANSWERS, payload: { selectedWeek, answers, uid, toaster, firstData } })
  }

  const handleDiscard = () => {
    dispatch(answersActions.updateAnswers({ answers: compare, uid }))
  }

  const { buttonChangesMsg, buttonSaveMsg, buttonCancelMsg } = i18n('buttons') as LocaleType
  const { successMsg, failureMsg } = i18n('week') as LocaleType

  return currentWeek > -1 ? (
    <div className="container animate-fade-in-up" ref={containerRef}>
      <div className="week-header">
        <div className="week-header__name bold">{name}</div>
      </div>
      <OtherUser containerRef={containerRef} />
      <ToastContainer position="top-center" autoClose={duration * 10} theme="colored" pauseOnHover={false} />
      {questions &&
        Object.keys(questions)
          .sort((a: string, b: string) => {
            return questions[Number(a)].deadline - questions[Number(b)].deadline
          })
          .map((el) => Number(el))
          .map((id, index) => (
            <div key={index}>
              <WeekQuestion id={id} />
            </div>
          ))}
      {isItYou ? (
        <div className="week-buttons">
          <Button onClick={handleSubmit} disabled={!gotChanges} className="week-button">
            {!gotChanges ? buttonChangesMsg : buttonSaveMsg}
          </Button>
          <Button onClick={handleDiscard} disabled={!gotChanges} className="week-button">
            {buttonCancelMsg}
          </Button>
        </div>
      ) : null}
    </div>
  ) : null
}
