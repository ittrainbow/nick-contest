import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector, useDispatch } from 'react-redux'

import { getAnswersResults, getDeadline, getLogo } from '../../helpers'
import { resultsActions, answersActions } from '../../redux/slices'
import { selectApp, selectUser } from '../../redux/selectors'
import { IStore } from '../../types'
import { Button } from '../../UI'
import { auth } from '../../db'

type YesNoHandlePropsType = {
  value: number
  id: number
  activity: number
}

export const WeekQuestion = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const [user] = useAuthState(auth)
  const weeks = useSelector((store: IStore) => store.weeks)
  const answers = useSelector((store: IStore) => store.answers)
  const compare = useSelector((store: IStore) => store.compare)
  const results = useSelector((store: IStore) => store.results)
  const { selectedWeek, isItYou, otherUserUID } = useSelector(selectApp)
  const { admin, adminAsPlayer, uid } = useSelector(selectUser)
  const { questions } = weeks[selectedWeek]
  const { away, home, deadline, score } = questions[id]
  const [outdated, setOutdated] = useState<boolean>(new Date().getTime() > deadline)

  // helpers

  const handleDiscard = () => {
    const oldAnswer = compare.answers[selectedWeek] && compare.answers[selectedWeek][id]

    oldAnswer
      ? dispatch(answersActions.updateSingleAnswer({ selectedWeek, uid, id, answer: oldAnswer }))
      : dispatch(answersActions.deleteSingleAnswer({ selectedWeek, uid, id }))
  }

  useEffect(() => {
    setOutdated(new Date().getTime() > deadline)
  }, [selectedWeek, deadline])

  useEffect(() => {
    const getOutdated = () => {
      if (!outdated && new Date().getTime() > deadline) {
        setOutdated(true)
        handleDiscard()
      }
    }

    getOutdated()
    const interval = setInterval(() => getOutdated(), 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [selectedWeek, outdated])

  const adm = admin && !adminAsPlayer
  const buttonData = adm ? results : answers[isItYou ? uid : otherUserUID]

  // const activity = (): number => {
  //   return ((!isItYou && outdated) || isItYou) && buttonData && buttonData[selectedWeek]
  //     ? buttonData[selectedWeek][id]
  //     : 0
  // }

  const activity =
    ((!isItYou && outdated) || isItYou) && buttonData && buttonData[selectedWeek] ? buttonData[selectedWeek][id] : 0

  // action handlers

  const handleClick = (props: YesNoHandlePropsType) => {
    const userOnTimeOrAdmin = new Date().getTime() < deadline || adm

    if (isItYou && user && userOnTimeOrAdmin) {
      const { value, id, activity } = props
      const newValue = value === activity ? 0 : value

      if (!adm) {
        !!newValue
          ? dispatch(answersActions.updateSingleAnswer({ selectedWeek, uid, id, answer: newValue }))
          : dispatch(answersActions.deleteSingleAnswer({ selectedWeek, uid, id }))
      }

      if (adm) {
        !!newValue
          ? dispatch(resultsActions.updateSingleResult({ selectedWeek, uid, id, answer: newValue }))
          : dispatch(resultsActions.deleteSingleResult({ selectedWeek, uid, id }))
      }
    }
  }

  // render styles and locales

  const getScoreResult = () => {
    const [away, home] = score.split('-').map((el) => Number(el))
    if (away > home) return 1
    if (away < home) return 2
    return 0
  }

  const getButtonClass = (id: number, buttonNumber: number) => {
    const resultsResult = results[selectedWeek] && results[selectedWeek][id]
    const result = score.length > 0 ? getScoreResult() : resultsResult

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
    const { answer } = getAnswersResults(answers, results, selectedWeek, getUid, id)

    const resultsResult = results[selectedWeek] && results[selectedWeek][id]
    const result = score.length > 0 ? getScoreResult() : resultsResult

    const allowedStyles = (!isItYou && outdated) || isItYou

    if (outdated && result && answer) {
      console.log(100, away, home, answer, result, answer === result)
      const style = result === answer ? 'question__green' : 'question__red'
      styles.push(style)
    }

    if (allowedStyles && !adm && week && week[id] > 0) {
      styles.push('question__grey')
    }

    return styles.join(' ')
  }

  const drawScore = () => {
    return <div className="question__score">{score}</div>
  }

  const drawDeadline = () => {
    return (
      <div className="question__deadline" style={{ opacity: outdated ? 0.3 : 1 }}>
        {getDeadline(deadline)}
      </div>
    )
  }

  return (
    <div className={getQuestionClass(id)}>
      <div className="question__desc">
        <div className="question__teams">
          {away.trim()} @ {home.trim()}
        </div>
        {score.length > 0 ? drawScore() : drawDeadline()}
        {/* {total !== '1' ? `: ${total}` : null} */}
      </div>
      <div className="question__actions">
        <div style={{ filter: activity !== 1 || adm ? 'grayscale(100%)' : '' }}>
          <Button className={getButtonClass(id, 1)} onClick={() => handleClick({ value: 1, id, activity: activity })}>
            {getLogo(away)}
          </Button>
        </div>
        <div style={{ filter: activity !== 2 || adm ? 'grayscale(100%)' : '' }}>
          <Button className={getButtonClass(id, 2)} onClick={() => handleClick({ value: 2, id, activity: activity })}>
            {getLogo(home)}
          </Button>
        </div>
      </div>
    </div>
  )
}
