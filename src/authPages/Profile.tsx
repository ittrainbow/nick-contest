import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { Input } from '@mui/material'
import { User } from 'firebase/auth'

import { Button } from '../UI'
import { selectApp, selectUser } from '../redux/selectors'
import { UPDATE_PROFILE } from '../redux/storetypes'
import { userActions } from '../redux/slices'
import { i18n, LocaleType } from '../locale'
import { animateFadeOut } from '../helpers'
import { auth } from '../db'

export const Profile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user] = useAuthState(auth)
  const { name } = useSelector(selectUser)
  const { tabActive, duration } = useSelector(selectApp)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>()
  const [tempName, setTempName] = useState(name)

  // container fade animations

  useEffect(() => {
    tabActive !== 1 && animateFadeOut(containerRef)
  }, [tabActive])

  // helpers

  useEffect(() => {
    inputRef.current?.focus()
    // eslint-disable-next-line
  }, [])

  const noChanges = name === tempName && !!tempName.length

  // action handlers

  const handleSubmit = async () => {
    const { uid } = user as User
    const payload = { uid, name: tempName }

    dispatch({ type: UPDATE_PROFILE, payload })
    dispatch(userActions.updateUser(payload))
    navigate(-1)
  }

  const handleDiscard = () => {
    animateFadeOut(containerRef)
    setTimeout(() => navigate(-1), duration)
  }

  // render styles and locales

  const { profileHeaderMsg, profileNameMsg, profileLangMsg } = i18n('auth') as LocaleType
  const { buttonChangesMsg, buttonCancelMsg, buttonSaveMsg } = i18n('buttons') as LocaleType

  return (
    <div className="container auth animate-fade-in-up" ref={containerRef}>
      <div className="auth__data">
        <div className="text-container bold">{profileHeaderMsg}</div>
        <div className="text-container">{profileLangMsg}</div>
        <div className="text-container">{profileNameMsg}</div>
        <Input type="text" inputRef={inputRef} onChange={(e) => setTempName(e.target.value)} value={tempName} />
        <Button disabled={noChanges} onClick={handleSubmit}>
          {noChanges ? buttonChangesMsg : buttonSaveMsg}
        </Button>
        <Button onClick={handleDiscard}>{buttonCancelMsg}</Button>
      </div>
    </div>
  )
}
