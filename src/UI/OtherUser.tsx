import { useSelector, useDispatch } from 'react-redux'

import { selectApp } from '../redux/selectors'
import { i18n, LocaleType } from '../locale'
import { appActions } from '../redux/slices'
import { animateFadeOut } from '../helpers'
import { FadeRefType } from '../types'

type OtherUserPropsType = {
  containerRef: FadeRefType
}

export const OtherUser = ({ containerRef }: OtherUserPropsType) => {
  const dispatch = useDispatch()
  const { otherUserName, isItYou, duration } = useSelector(selectApp)

  const handleDiscard = () => {
    animateFadeOut(containerRef)
    setTimeout(() => {
      dispatch(appActions.setIsItYou(true))
      dispatch(appActions.setOtherUserName(''))
      dispatch(appActions.setOtherUserUID(''))
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
