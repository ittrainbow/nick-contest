import { useSelector, useDispatch } from 'react-redux'

import { getAnswersResults, getDeadline, getLogo } from '../../helpers'
import { resultsActions, answersActions } from '../../redux/slices'
import { selectApp, selectUser } from '../../redux/selectors'
import { IStore, YesNoHandlePropsType } from '../../types'
// import { icon1, icon2 } from '../../helpers/icons'
import { Button } from '../../UI'

export const WeekQuestion = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const weeks = useSelector((store: IStore) => store.weeks)
  const answers = useSelector((store: IStore) => store.answers)
  const results = useSelector((store: IStore) => store.results)
  const { selectedWeek, isItYou, otherUserUID } = useSelector(selectApp)
  const { admin, adminAsPlayer, uid } = useSelector(selectUser)
  const { questions } = weeks[selectedWeek]
  const { away, home, deadline } = questions[id]

  // helpers

  const adm = admin && !adminAsPlayer
  const outdated = new Date().getTime() > deadline
  const buttonData = adm ? results : answers[isItYou ? uid : otherUserUID]
  const writeAllowed = adm || (!adm && !outdated)

  const getActivity = (id: number) => {
    return ((!isItYou && outdated) || isItYou) && buttonData && buttonData[selectedWeek]
      ? buttonData[selectedWeek][id]
      : 0
  }

  // action handlers

  const handleClick = (props: YesNoHandlePropsType) => {
    if (writeAllowed && isItYou) {
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
    const activity = getActivity(id)
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

  return (
    <div className={getQuestionClass(id)}>
      <div className="question__desc">
        <div className="question__teams">
          <div>
            {away.trim()} @ {home.trim()}
          </div>
        </div>
        {getDeadline(deadline)}
        {/* {total !== '1' ? `: ${total}` : null} */}
      </div>
      <div className="question__actions">
        <Button
          className={getButtonClass(id, 1)}
          onClick={() => handleClick({ value: 1, id, activity: getActivity(id) })}
        >
          {getLogo(away)}
        </Button>
        <Button
          className={getButtonClass(id, 2)}
          onClick={() => handleClick({ value: 2, id, activity: getActivity(id) })}
        >
          {getLogo(home)}
        </Button>
      </div>
    </div>
  )
}
