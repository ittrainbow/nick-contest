import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getAnswersResults, getDeadline, getLogo } from '../../helpers'
import { resultsActions, answersActions } from '../../redux/slices'
import { selectApp, selectUser } from '../../redux/selectors'
import { IStore, YesNoHandlePropsType } from '../../types'
import { Button } from '../../UI'

export const WeekQuestion = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const weeks = useSelector((store: IStore) => store.weeks)
  const answers = useSelector((store: IStore) => store.answers)
  const compare = useSelector((store: IStore) => store.compare)
  const results = useSelector((store: IStore) => store.results)
  const [outdated, setOutdated] = useState<boolean>(false)
  const { selectedWeek, isItYou, otherUserUID } = useSelector(selectApp)
  const { admin, adminAsPlayer, uid } = useSelector(selectUser)
  const { questions } = weeks[selectedWeek]
  const { away, home, deadline } = questions[id]

  // helpers

  const handleDiscard = () => {
    const active = compare.answers
    const getOldAnswer = (active[selectedWeek] && active[selectedWeek][id]) || 0
    const discardAnswersData = structuredClone(answers)
    discardAnswersData[uid][selectedWeek][id] = getOldAnswer

    dispatch(answersActions.updateAnswers({ answers: discardAnswersData[uid], uid }))
  }

  useEffect(() => {
    const getOutdated = () => {
      const newOutdated = new Date().getTime() > deadline
      if (newOutdated !== outdated) {
        setOutdated(newOutdated)
        handleDiscard()
      }
    }
    getOutdated()
    const interval = setInterval(() => getOutdated(), 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [outdated])

  const adm = admin && !adminAsPlayer
  const buttonData = adm ? results : answers[isItYou ? uid : otherUserUID]
  const writeAllowed = adm || (!adm && !outdated)

  const activity =
    ((!isItYou && outdated) || isItYou) && buttonData && buttonData[selectedWeek] ? buttonData[selectedWeek][id] : 0

  // action handlers

  const handleClick = (props: YesNoHandlePropsType) => {
    const onTime = new Date().getTime() < deadline || adm
    if (writeAllowed && isItYou && onTime && uid) {
      const { value, id, activity } = props
      const data = structuredClone(adm ? results : answers[uid]) || {}
      if (!data[selectedWeek]) data[selectedWeek] = {}
      if (value === activity) {
        if (Object.keys(data[selectedWeek]).length === 1) {
          delete data[selectedWeek]
        } else {
          delete data[selectedWeek][id]
        }
      } else {
        data[selectedWeek][id] = value
      }

      adm
        ? dispatch(resultsActions.updateResults({ results: data, selectedWeek }))
        : dispatch(answersActions.updateAnswers({ answers: data, uid }))
    }
  }

  // render styles and locales

  const getButtonClass = (id: number, buttonNumber: number) => {
    // const activity = getActivity(id)
    const result = results[selectedWeek] && results[selectedWeek][id]

    const thisButton = activity === buttonNumber
    const correct = result && activity === result
    const wrong = result && activity !== result

    if (thisButton) {
      if (adm) return 'yn yn-black'
      if (!outdated && isItYou) return 'yn yn-black'
      if (outdated && !adm && correct) return 'yn yn-correct'
      if (outdated && !adm && wrong) return 'yn yn-wrong'
      if (outdated) return 'yn yn-dark'
    }
    return 'yn yn-grey'
  }

  const getQuestionClass = (id: number) => {
    const getUid = isItYou ? uid : otherUserUID
    const week = answers[getUid] && answers[getUid][selectedWeek]
    const styles = ['question']
    const { ans, res } = getAnswersResults(answers, results, selectedWeek, getUid, id)

    const drawPlayerStyles = adminAsPlayer || !admin
    const allowedStyles = (!isItYou && outdated) || isItYou

    if (drawPlayerStyles && outdated && res && ans) {
      const style = res === ans ? 'question__green' : 'question__red'
      styles.push(style)
    }

    if (allowedStyles && !adm && week && week[id] > 0) {
      styles.push('question__grey')
    }

    return styles.join(' ')
  }

  // const activity = getActivity(id)

  return (
    <div className={getQuestionClass(id)}>
      <div className="question__desc">
        <div className="question__teams">
          {away.trim()} @ {home.trim()}
        </div>
        <div className="question__deadline" style={{ opacity: outdated ? 0.5 : 1 }}>
          {getDeadline(deadline)}
        </div>
        {/* {total !== '1' ? `: ${total}` : null} */}
      </div>
      <div className="question__actions">
        <div style={{ filter: activity !== 1 || adm ? 'grayscale(100%)' : '', transition: '.22s ease-in-out' }}>
          <Button className={getButtonClass(id, 1)} onClick={() => handleClick({ value: 1, id, activity })}>
            {getLogo(away)}
          </Button>
        </div>
        <div style={{ filter: activity !== 2 || adm ? 'grayscale(100%)' : '' }}>
          <Button className={getButtonClass(id, 2)} onClick={() => handleClick({ value: 2, id, activity })}>
            {getLogo(home)}
          </Button>
        </div>
      </div>
    </div>
  )
}
