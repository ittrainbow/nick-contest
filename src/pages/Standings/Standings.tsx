import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BsGearFill } from 'react-icons/bs'

import { selectApp, selectStandings, selectTools } from '../../redux/selectors'
import { StandingsTools, StandingsHeader, StandingsArrows, StandingsRow } from '.'
import { appActions, toolsActions, userActions } from '../../redux/slices'
import { FETCH_OTHER_USER } from '../../redux/storetypes'
import { i18n, LocaleType } from '../../locale'
import { useFade } from '../../hooks'
import { OtherUser } from '../../UI'
import { IStore } from '../../types'

export const Standings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showTools, showBuddies, showOneWeek, standingsSearch } = useSelector(selectTools)
  const results = useSelector((store: IStore) => store.results)
  const weeks = useSelector((store: IStore) => store.weeks)
  const user = useSelector((store: IStore) => store.user)
  const { tabActive, duration } = useSelector(selectApp)
  const { season, week } = useSelector(selectStandings)
  const { uid, buddies, admin } = user
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [fadeOutTools, setFadeOutTools] = useState<boolean>(false)

  // container fade animations

  const containerFade = useFade({ ref: containerRef })
  const bodyFade = useFade({ ref: bodyRef })

  useEffect(() => {
    tabActive !== 4 && containerFade.triggerFade()
  }, [tabActive, containerFade])

  // helpers

  useEffect(() => {
    showTools && dispatch(toolsActions.setShowTools(false))
    // eslint-disable-next-line
  }, [])

  // action handlers

  const handleSwitchTools = () => {
    setFadeOutTools(!fadeOutTools)
    bodyFade.triggerFade()
    setTimeout(() => dispatch(toolsActions.switchShowTools()), duration)
  }

  const handleClickOnUser = (otherUserName: string, otherUserUID: string) => {
    if (uid && otherUserUID !== uid) {
      containerFade.triggerFade()
      setTimeout(() => {
        const otherUser = { otherUserName, otherUserUID, tabActive: 3, isItYou: false }
        dispatch(appActions.setOtherUserFromStandings(otherUser))
        admin && dispatch(userActions.setAdminAsPlayer(true))
        dispatch({ type: FETCH_OTHER_USER, payload: otherUserUID })
        navigate('/season')
      }, duration)
    }
  }

  // render styles and locales

  const getGearClass = `standings-top-container__${showTools ? 'gear-on' : 'gear-off'}`

  const { tablePSOne, tablePSTwo, tableHeaderhMsg, tableNoGamesMsg } = i18n('standings') as LocaleType

  const getLastWeekName = () => {
    const lastWeekNumber = Number(Object.keys(results).slice(-1)[0])
    const lastWeekName = !isNaN(lastWeekNumber) && weeks[lastWeekNumber].name.split('.')[1]
    return lastWeekName ? tableHeaderhMsg + lastWeekName : tableNoGamesMsg
  }

  return (
    <>
      <div className="container animate-fade-in-up" ref={containerRef}>
        <div className="standings-top-container">
          <div className="standings-top-container__title">{getLastWeekName()}</div>
          <BsGearFill onClick={handleSwitchTools} className={getGearClass} />
        </div>
        <div ref={bodyRef}>
          {showTools ? <StandingsTools tableRef={tableRef} /> : null}
          <div className="standings" ref={tableRef}>
            <OtherUser containerRef={containerRef} />
            <StandingsHeader />
            {Object.values(showOneWeek ? week : season)
              .filter((el) => el.name.toLowerCase().includes(standingsSearch.toLowerCase()))
              .filter((el) => (showBuddies ? buddies.includes(el.uid) : el))
              .map((el, index) => {
                const even = index % 2 === 0
                return <StandingsRow el={el} even={even} key={index} fade={containerFade.triggerFade} />
              })}
            <div className="tierline">{tablePSOne}</div>
            <div className="tierline">{tablePSTwo}</div>
          </div>
        </div>
      </div>
      <StandingsArrows />
    </>
  )
}
