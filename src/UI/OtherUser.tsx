import { useSelector, useDispatch } from 'react-redux'

import { selectApp } from '../redux/selectors'
import { i18n, LocaleType } from '../locale'
import { appActions } from '../redux/slices'
import { FadeRefType } from '../types'
import { useFade } from '../hooks'

type OtherUserPropsType = {
  containerRef: FadeRefType
}

export const OtherUser = ({ containerRef }: OtherUserPropsType) => {
  const dispatch = useDispatch()
  const { otherUserName, isItYou, duration } = useSelector(selectApp)

  const { triggerFade } = useFade({ ref: containerRef })

  const handleDiscard = () => {
    triggerFade()
    setTimeout(() => {
      dispatch(appActions.setIsItYou(true))
      dispatch(appActions.clearOtherUser())
    }, duration)
  }

  const { otherUser1msg, otherUser2msg, otherUser3msg } = i18n('otheruser') as LocaleType

  return isItYou ? null : (
    <div>
      <button className="otheruser" onClick={handleDiscard}>
        <div className="otheruser__text">{otherUser1msg}</div>
        <div className="otheruser__text">
          {otherUser2msg}
          <b>{otherUserName}</b>
          {otherUser3msg}
        </div>
      </button>
    </div>
  )
}
