import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'

import { FETCH_OTHER_USER, SET_BUDDIES } from '../../redux/storetypes'
import { selectAnswers, selectApp, selectUser } from '../../redux/selectors'
import { getTableRowParams } from '../../helpers'
import { appActions } from '../../redux/slices'
import { IUserStandings } from '../../types'

type StandingsRowType = {
  el: IUserStandings
  even: boolean
  fade: () => void
}

export const StandingsRow = ({ el, even, fade }: StandingsRowType) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const answers = useSelector(selectAnswers)
  const { duration } = useSelector(selectApp)
  const { buddies } = user

  const handleClickOnUser = (otherUserName: string, otherUserUID: string) => {
    const { uid } = user
    if (uid && otherUserUID !== uid) {
      fade()
      setTimeout(() => {
        dispatch(appActions.setOtherUserFromStandings({ otherUserName, otherUserUID }))
        !answers[otherUserUID] && dispatch({ type: FETCH_OTHER_USER, payload: otherUserUID })
        navigate('/week')
      }, duration)
    }
  }

  const handleAddRemoveBuddy = (uid: string) => {
    !!user.name.length && dispatch({ type: SET_BUDDIES, payload: { buddyUid: uid, buddies } })
  }

  const { name, userAnswers, correct, position, uid } = getTableRowParams(el)
  const buddy = buddies?.includes(uid)

  return (
    <div className="standings__row">
      <div className={`col-zero ${even ? 'standings__dark' : ''}`}>{position}</div>
      <div
        className={`col-one ${even ? 'standings__dark' : ''}`}
        onClick={() => handleAddRemoveBuddy(uid)}
        style={{ color: buddy ? 'darkgoldenrod' : '#c7c7c7' }}
      >
        <FaStar />
      </div>
      <div
        className={`col-two ${even ? 'standings__dark' : ''}`}
        onClick={() => handleClickOnUser(name, uid)}
        style={{ fontWeight: user.uid === uid ? 600 : '' }}
      >
        {name}
      </div>
      <div className={`col-three ${even ? 'standings__dark' : ''}`}>{userAnswers}</div>
      <div className={`col-four ${even ? 'standings__dark' : ''}`}>{correct}</div>
    </div>
  )
}
