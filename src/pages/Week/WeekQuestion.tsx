import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector, useDispatch } from 'react-redux'

import { selectAnswers, selectApp, selectCompare, selectUser, selectWeeks } from '../../redux/selectors'
import { getAnswers, getDeadline, getLogo, getResultFromScore } from '../../helpers'
import { answersActions } from '../../redux/slices'
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
  const weeks = useSelector(selectWeeks)
  const answers = useSelector(selectAnswers)
  const compare = useSelector(selectCompare)
  const { selectedWeek, isItYou, otherUserUID } = useSelector(selectApp)
  const { uid } = useSelector(selectUser)
  const { questions } = weeks[selectedWeek]
  const { away, home, deadline, score } = questions[id]
  const [outdated, setOutdated] = useState<boolean>(new Date().getTime() > deadline)

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

  const buttonData = answers[isItYou ? uid : otherUserUID]
  const drawActivity = (!isItYou && outdated) || isItYou
  const result = getResultFromScore(score.trim())
  const activity = drawActivity && buttonData && buttonData[selectedWeek] ? buttonData[selectedWeek][id] : 0

  const handleClick = (props: YesNoHandlePropsType) => {
    if (isItYou && user && new Date().getTime() < deadline) {
      const { value, id, activity } = props
      const newValue = value === activity ? 0 : value
      !!newValue
        ? dispatch(answersActions.updateSingleAnswer({ selectedWeek, uid, id, answer: newValue }))
        : dispatch(answersActions.deleteSingleAnswer({ selectedWeek, uid, id }))
    }
  }

  const handleDiscard = () => {
    const oldAnswer = compare[selectedWeek] && compare[selectedWeek][id]

    oldAnswer
      ? dispatch(answersActions.updateSingleAnswer({ selectedWeek, uid, id, answer: oldAnswer }))
      : dispatch(answersActions.deleteSingleAnswer({ selectedWeek, uid, id }))
  }

  const getButtonClass = (button: number) => {
    const thisButton = activity === button
    const correct = result > 0 && activity === result
    const wrong = result > 0 && activity !== result

    if (thisButton) {
      if (!outdated && isItYou) return 'yn yn__black'
      if (outdated && correct) return 'yn yn__correct'
      if (outdated && wrong) return 'yn yn__wrong'
      if (outdated) return 'yn yn__dark'
    }
    return 'yn yn__grey'
  }

  const getQuestionClass = (id: number) => {
    const styles = ['question']
    const getUid = isItYou ? uid : otherUserUID
    const week = answers[getUid] && answers[getUid][selectedWeek]
    const answer = getAnswers(answers, selectedWeek, getUid, id)
    const allowedStyles = (!isItYou && outdated) || isItYou

    outdated && result > 0 && answer && styles.push(result === answer ? 'result-class__green' : 'result-class__red')
    allowedStyles && week && week[id] > 0 && styles.push('result-class__grey')

    return styles.join(' ')
  }

  const drawScore = () => <div className="question__info__score">{score}</div>

  const drawDeadline = () => (
    <div className="question__info__deadline" style={{ color: outdated ? 'darkred' : '' }}>
      {getDeadline(deadline)}
    </div>
  )

  return (
    <div className={getQuestionClass(id)}>
      <div className="question__desc">
        <div className="question__teams">
          {away.trim()} @ {home.trim()}
        </div>
        <div className="question__info">{score.length > 0 ? drawScore() : drawDeadline()}</div>
      </div>
      <div className="question__actions">
        <div style={{ filter: activity !== 1 ? 'grayscale(100%)' : '' }}>
          <Button className={getButtonClass(1)} onClick={() => handleClick({ value: 1, id, activity: activity })}>
            {getLogo(away)}
          </Button>
        </div>
        <div style={{ filter: activity !== 2 ? 'grayscale(100%)' : '' }}>
          <Button className={getButtonClass(2)} onClick={() => handleClick({ value: 2, id, activity: activity })}>
            {getLogo(home)}
          </Button>
        </div>
      </div>
    </div>
  )
}
