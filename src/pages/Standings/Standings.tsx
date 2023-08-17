import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BsGearFill } from 'react-icons/bs'

import { selectApp, selectStandings, selectTools, selectUser } from '../../redux/selectors'
import { StandingsTools, StandingsHeader, StandingsArrows, StandingsRow } from '.'
import { toolsActions } from '../../redux/slices'
import { i18n, LocaleType } from '../../locale'
import { useFade } from '../../hooks'
import { OtherUser } from '../../UI'

export const Standings = () => {
  const dispatch = useDispatch()
  const { showTools, showBuddies, showOneWeek, standingsSearch } = useSelector(selectTools)
  const user = useSelector(selectUser)
  const { tabActive, duration } = useSelector(selectApp)
  const { season, week } = useSelector(selectStandings)
  const { buddies } = user
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [fadeOutTools, setFadeOutTools] = useState<boolean>(false)

  const containerFade = useFade({ ref: containerRef })
  const bodyFade = useFade({ ref: bodyRef })

  useEffect(() => {
    tabActive !== 4 && containerFade.triggerFade()
  }, [tabActive, containerFade])

  useEffect(() => {
    showTools && dispatch(toolsActions.setShowTools(false))
    // eslint-disable-next-line
  }, [])

  const handleSwitchTools = () => {
    setFadeOutTools(!fadeOutTools)
    bodyFade.triggerFade()
    setTimeout(() => dispatch(toolsActions.switchShowTools()), duration)
  }

  const getGearClass = `standings-top-container__${showTools ? 'gear-on' : 'gear-off'}`

  const { tablePSOne, tablePSTwo, tableStandings } = i18n('standings') as LocaleType

  return (
    <>
      <div className="container animate-fade-in-up" ref={containerRef}>
        <div className="standings-top-container">
          <div className="standings-top-container__title">{tableStandings}</div>
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
