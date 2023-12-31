import { useEffect, useState, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Input } from '@mui/material'

import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../db'
import { selectApp } from '../redux/selectors'
import { i18n, LocaleType } from '../locale'
import { ChangeInputType } from '../types'
import { useFade } from '../hooks'
import { Button } from '../UI'

export const Login = () => {
  const navigate = useNavigate()
  const [user, loading, error] = useAuthState(auth)
  const { tabActive, duration } = useSelector(selectApp)
  const [password, setPassword] = useState<string>(localStorage.getItem('contestPassword') || '')
  const [email, setEmail] = useState<string>(localStorage.getItem('contestEmail') || '')
  const [emailValid, setEmailValid] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // container fade animations

  const { triggerFade } = useFade({ ref: containerRef })

  useEffect(() => {
    tabActive !== 1 && triggerFade()
  }, [tabActive, triggerFade])

  // helpers

  const loginButtonActive = emailValid && password.length > 2
  const trimSpaces = (value: string) => value.replace(/\s/g, '')

  useEffect(() => {
    const checkEmailValid = /\S+@\S+\.\S+/.test(email)
    setEmailValid(checkEmailValid)
  }, [email])

  useEffect(() => {
    if (loading) return
    user && navigate('/dashboard')
    error && alert(error)
    // eslint-disable-next-line
  }, [user, loading, error])

  // action handlers

  const handleEmailInput = (e: ChangeInputType) => {
    const { value } = e.target
    setEmail(trimSpaces(value))
  }

  const handlePasswordInput = (e: ChangeInputType) => {
    const { value } = e.target
    setPassword(trimSpaces(value))
  }

  const handleGoogleClick = async () => {
    await signInWithGoogle()
  }

  const handleEmailLogin = async () => {
    localStorage.setItem('contestEmail', email)
    localStorage.setItem('contestPassword', password)
    await logInWithEmailAndPassword(email, password)
  }

  const handleToRegister = () => {
    triggerFade()
    setTimeout(() => navigate('/register'), duration)
  }

  const handleToReset = () => {
    triggerFade()
    setTimeout(() => navigate('/reset'), duration)
  }

  // render styles and locales

  const { buttonLoginMsg, buttonLoginGoogleMsg } = i18n('buttons') as LocaleType
  const { regMsg, regIntro, forgotMsg, emailMsg, passwordMsg } = i18n('auth') as LocaleType

  return (
    <div className="container auth animate-fade-in-up" ref={containerRef}>
      <div className="auth__data">
        <Input type="text" value={email} onChange={handleEmailInput} placeholder={emailMsg} />
        <Input type="password" value={password} onChange={handlePasswordInput} placeholder={passwordMsg} />
        <Button className="login" disabled={!loginButtonActive} onClick={handleEmailLogin}>
          {buttonLoginMsg}
        </Button>
        <Button className="google" onClick={handleGoogleClick}>
          {buttonLoginGoogleMsg}
        </Button>
        <div className="link-container" onClick={handleToReset}>
          <div className="link-container__inner">{forgotMsg}</div>
        </div>
        <div className="link-container" onClick={handleToRegister}>
          {regIntro} <div className="link-container__inner">{regMsg}</div>
        </div>
      </div>
    </div>
  )
}
