import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'

import { answersActions, compareActions, userActions } from '../redux/slices'
import { selectApp, selectUser } from '../redux/selectors'
import { animateFadeOut } from '../helpers'
import { Button } from '../UI'
import { logout } from '../db/auth'
import { auth } from '../db'
import { i18n, LocaleType } from '../locale'
import { useFade } from '../hooks/useFade'

export const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const { tabActive, duration } = useSelector(selectApp)
  const { name, admin } = useSelector(selectUser)
  const containerRef = useRef<HTMLDivElement>(null)

  // container fade animations

  useFade({ ref: containerRef, condition: tabActive !== 1 })

  // action handlers

  const handleLogout = () => {
    dispatch(userActions.clearUser())
    dispatch(answersActions.clearAnswers())
    dispatch(compareActions.clearCompare())
    logout()
    navigate('/userpage')
  }

  const handleNavigate = () => {
    animateFadeOut(containerRef)
    setTimeout(() => navigate('/profile'), duration)
  }

  // render styles and locales

  const { dashboardEnterMsg, dashboardAdminMsg } = i18n('auth') as LocaleType
  const { buttonProfileMsg, buttonLogoutMsg } = i18n('buttons') as LocaleType

  return (
    <div className="container auth animate-fade-in-up" ref={containerRef}>
      <div className="auth__data">
        <div className="text-container bold">{dashboardEnterMsg}</div>
        <div>{name ? name : '...loading'}</div>
        <div>{user ? user.email : '...loading'}</div>
        {admin ? <div className="text-container">{dashboardAdminMsg}</div> : null}
        <Button onClick={handleNavigate}>{buttonProfileMsg}</Button>
        <Button onClick={handleLogout}>{buttonLogoutMsg}</Button>
      </div>
    </div>
  )
}
