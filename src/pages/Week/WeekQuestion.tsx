import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector, useDispatch } from 'react-redux'

import { getAnswers, getDeadline, getLogo, getResultFromScore } from '../../helpers'
import { selectApp, selectUser } from '../../redux/selectors'
import { answersActions } from '../../redux/slices'
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
  const { selectedWeek, isItYou, otherUserUID } = useSelector(selectApp)
  const { admin, uid } = useSelector(selectUser)
  const { questions } = weeks[selectedWeek]
  const { away, home, deadline, score } = questions[id]
  const [outdated, setOutdated] = useState<boolean>(new Date().getTime() > deadline)

  // helpers

  const handleDiscard = () => {
    const oldAnswer = compare[selectedWeek] && compare[selectedWeek][id]

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

  const buttonData = answers[isItYou ? uid : otherUserUID]
  const result = getResultFromScore(score)

  const activity =
    ((!isItYou && outdated) || isItYou) && buttonData && buttonData[selectedWeek] ? buttonData[selectedWeek][id] : 0

  // action handlers

  const handleClick = (props: YesNoHandlePropsType) => {
    const userOnTimeOrAdmin = new Date().getTime() < deadline || admin

    if (isItYou && user && userOnTimeOrAdmin) {
      const { value, id, activity } = props
      const newValue = value === activity ? 0 : value

      !!newValue
        ? dispatch(answersActions.updateSingleAnswer({ selectedWeek, uid, id, answer: newValue }))
        : dispatch(answersActions.deleteSingleAnswer({ selectedWeek, uid, id }))
    }
  }

  // render styles and locales

  const getButtonClass = (buttonNumber: number) => {
    const thisButton = activity === buttonNumber
    const correct = result > 0 && activity === result
    const wrong = result > 0 && activity !== result

    if (thisButton) {
      // if (admin) return 'yn yn-black'
      if (!outdated && isItYou) return 'yn yn-black'
      if (outdated && correct) return 'yn yn-correct'
      if (outdated && wrong) return 'yn yn-wrong'
      if (outdated) return 'yn yn-dark'
    }
    return 'yn yn-grey'
  }

  const getQuestionClass = (id: number) => {
    const getUid = isItYou ? uid : otherUserUID
    const week = answers[getUid] && answers[getUid][selectedWeek]
    const styles = ['question']
    const answer = getAnswers(answers, selectedWeek, getUid, id)
    const allowedStyles = (!isItYou && outdated) || isItYou

    if (outdated && result > 0 && answer) {
      const style = result === answer ? 'question__green' : 'question__red'
      styles.push(style)
    }

    if (allowedStyles && week && week[id] > 0) {
      styles.push('question__grey')
    }

    return styles.join(' ')
  }

  const drawScore = () => {
    return <div className="question__score">{score}</div>
  }

  const drawDeadline = () => {
    return (
      <div
        className="question__deadline"
        style={{ color: outdated ? 'darkred' : '', opacity: activity > 0 ? 0.8 : 0.4 }}
      >
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
