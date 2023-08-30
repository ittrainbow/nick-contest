import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { appActions, editorActions, toolsActions } from '../redux/slices'
import { selectApp, selectUser } from '../redux/selectors'
import { useMenu } from './useMenu'

export const useSwipe = () => {
  const menu = useMenu()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { tabActive, duration, editor, currentWeek, selectedWeek } = useSelector(selectApp)
  const { admin } = useSelector(selectUser)

  type SwipeHelperProps = {
    moveX: number
    canSwipeLeft: boolean
    canSwipeRight: boolean
  }

  const swipeHelper = ({ moveX, canSwipeLeft, canSwipeRight }: SwipeHelperProps) => {
    const container = document.querySelector('.container')

    if (moveX > 0 && canSwipeLeft) {
      const list = container?.classList
      list?.add('animate-fade-out-right')
    }

    if (moveX < 0 && canSwipeRight) {
      const list = container?.classList
      list?.add('animate-fade-out-left')
    }
  }

  useEffect(() => {
    let startX: number
    let startY: number

    const listenerStart = (e: TouchEvent) => {
      startX = Math.round(e.touches[0].clientX)
      startY = Math.round(e.touches[0].clientY)
    }

    const listenerEnd = (e: TouchEvent) => {
      const endX = Math.round(e.changedTouches[0].clientX)
      const endY = Math.round(e.changedTouches[0].clientY)
      const moveX = endX - startX
      const isSwipe = Math.abs(moveX) > 70 && Math.abs(endY - startY) < 45

      if (isSwipe) {
        const limit = admin ? 6 : 4
        const canSwipeLeft = tabActive > 0
        const canSwipeRight = tabActive < limit
        const newTabActive =
          moveX < 0 ? (canSwipeRight ? tabActive + 1 : tabActive) : canSwipeLeft ? tabActive - 1 : tabActive

        swipeHelper({ moveX, canSwipeLeft, canSwipeRight })

        newTabActive === 5 && !editor && dispatch(appActions.setEditor(true))

        newTabActive === 4 &&
          editor &&
          dispatch(editorActions.clearEditor()) &&
          dispatch(toolsActions.setShowTools(false)) &&
          setTimeout(() => dispatch(appActions.setEditor(false)), duration)

        newTabActive === 2 &&
          selectedWeek !== currentWeek &&
          setTimeout(() => dispatch(appActions.setSelectedWeek(currentWeek)), duration)

        dispatch(appActions.setTabActive(newTabActive))
        setTimeout(() => navigate(menu[newTabActive].path), duration)
      }
    }

    document.addEventListener('touchstart', listenerStart)
    document.addEventListener('touchend', listenerEnd)

    return () => {
      document.removeEventListener('touchstart', listenerStart)
      document.removeEventListener('touchend', listenerEnd)
    }
    // eslint-disable-next-line
  }, [tabActive, admin, selectedWeek, editor])

  return
}
