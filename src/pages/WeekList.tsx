import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectApp, selectLocation, selectWeeks } from '../redux/selectors'
import { appActions, editorActions } from '../redux/slices'
import { useFade } from '../hooks'
import { OtherUser } from '../UI'
import { LocaleType, i18n } from '../locale'

export const WeekList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { editor, isItYou, tabActive, duration } = useSelector(selectApp)
  const { pathname } = useSelector(selectLocation)
  const weeks = useSelector(selectWeeks)
  const containerRef = useRef<HTMLDivElement>(null)

  // container fade animations

  const { triggerFade } = useFade({ ref: containerRef })

  useEffect(() => {
    const fromSeasonList = pathname.includes('season') && tabActive !== 3
    const fromEditorList = pathname.includes('calendar') && tabActive !== 5
    if (fromSeasonList || fromEditorList) triggerFade()
    // eslint-disable-next-line
  }, [tabActive])

  // action handlers

  const handleClick = (selectedWeek: number) => {
    triggerFade()
    dispatch(appActions.setSelectedWeek(selectedWeek))
    const setEditorStateWithNavigate = () => {
      dispatch(editorActions.setEditorState(weeks[selectedWeek]))
      navigate(`/editor/${selectedWeek}`)
    }
    setTimeout(() => (editor ? setEditorStateWithNavigate() : navigate(`/week/${selectedWeek}`)), duration)
  }

  // locale render and classes

  const { weekListMsg, weekListEditorMsg } = i18n('weeklist') as LocaleType

  const showOtherUserBar = !isItYou && !editor && !pathname.includes('calendar')

  return (
    <div className="container animate-fade-in-up" ref={containerRef}>
      <div className="weeklist__header">{editor ? weekListEditorMsg : weekListMsg}</div>
      {showOtherUserBar && <OtherUser containerRef={containerRef} />}
      {Object.keys(weeks)
        .map((el) => Number(el))
        .filter((el) => weeks[el].active || editor)
        .sort((a, b) => b - a)
        .map((el) => {
          const { name } = weeks[el]
          const selectedWeek = Number(el)
          return (
            <div key={selectedWeek} className="weeklist" onClick={() => handleClick(selectedWeek)}>
              <div className="weeklist__desc">{name}</div>
            </div>
          )
        })}
    </div>
  )
}
