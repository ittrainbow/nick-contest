import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { answersActions, resultsActions, userActions } from '../../redux/slices'
import { selectApp, selectLocation, selectUser } from '../../redux/selectors'
import { OtherUser, Button, Switch } from '../../UI'
import { useChanges, useFade } from '../../hooks'
import { WeekQuestion } from '.'
import * as TYPES from '../../redux/storetypes'
import { i18n, LocaleType } from '../../locale'
import { IStore, WeekType } from '../../types'

export const Week = () => {
  const dispatch = useDispatch()
  const { selectedWeek, currentWeek, isItYou, duration, tabActive } = useSelector(selectApp)
  const { admin, adminAsPlayer, uid } = useSelector(selectUser)
  const { pathname } = useSelector(selectLocation)
  const answers = useSelector((store: IStore) => store.answers)
  const results = useSelector((store: IStore) => store.results)
  const weeks = useSelector((store: IStore) => store.weeks)
  const compare = useSelector((store: IStore) => store.compare)
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

  // helpers

  const adm = admin && !adminAsPlayer

  // action handlers

  const handleSubmit = async () => {
    const firstData = !!Object.keys(answers[uid]).length
    const toastSuccess = () => toast.success(successMsg)
    const toastFailure = () => toast.error(failureMsg)
    const toaster = (success: boolean) => (success ? toastSuccess() : toastFailure())

    const type = adm ? TYPES.SUBMIT_RESULTS : TYPES.SUBMIT_ANSWERS
    const payload = adm ? { selectedWeek, results, toaster } : { selectedWeek, answers, uid, toaster, firstData }

    dispatch({ type, payload })
  }

  const handleDiscard = () => {
    admin && dispatch(resultsActions.updateResults({ results: compare.results, selectedWeek }))
    dispatch(answersActions.updateAnswers({ answers: compare.answers, uid }))
  }

  const handleAdminAsPlayer = () => {
    dispatch(userActions.setAdminAsPlayer(!adminAsPlayer))
  }

  // render styles and locales

  const { buttonChangesMsg, buttonSaveMsg, buttonCancelMsg } = i18n('buttons') as LocaleType
  const { successMsg, failureMsg, playerMsg, adminMsg } = i18n('week') as LocaleType

  return currentWeek > -1 ? (
    <div className="container animate-fade-in-up" ref={containerRef}>
      <div className="week-header">
        <div className="week-header__name bold">{name}</div>
        {admin && isItYou ? (
          <Switch onChange={handleAdminAsPlayer} checked={adminAsPlayer} messageOn={playerMsg} messageOff={adminMsg} />
        ) : null}
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
      <div className="week-buttons">
        <Button onClick={handleDiscard} disabled={!gotChanges} className="week-button">
          {buttonCancelMsg}
        </Button>
        <Button onClick={handleSubmit} disabled={!gotChanges} className="week-button">
          {!gotChanges ? buttonChangesMsg : buttonSaveMsg}
        </Button>
      </div>
    </div>
  ) : null
}
