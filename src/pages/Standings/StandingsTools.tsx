import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '@mui/material'

import { selectApp, selectTools } from '../../redux/selectors'
import { ChangeInputType, FadeRefType } from '../../types'
import { toolsActions } from '../../redux/slices'
import { i18n, LocaleType } from '../../locale'
import { Button, Switch } from '../../UI'
import { useFade } from '../../hooks'

type ToolsPropsType = {
  tableRef: FadeRefType
}

export const StandingsTools = ({ tableRef }: ToolsPropsType) => {
  const dispatch = useDispatch()
  const { showOneWeek, showBuddies, standingsSearch, showTools } = useSelector(selectTools)
  const { mobile, duration } = useSelector(selectApp)
  const toolsRef = useRef<HTMLDivElement>(null)
  const [showBuddiesLocal, setShowBuddiesLocal] = useState<boolean>(showBuddies)

  const { triggerFade } = useFade({ ref: tableRef })

  // action handlers

  const handleSwitchShowOneWeek = () => {
    const value = !showOneWeek
    localStorage.setItem('contestOneWeek', value.toString())
    dispatch(toolsActions.switchShowOneWeek())
  }

  const handleClearSearch = () => {
    dispatch(toolsActions.clearSearch())
  }

  const hancleChangeSearch = (e: ChangeInputType) => {
    const { value } = e.target
    dispatch(toolsActions.setSearch(value))
  }

  const handleSwitchBuddies = () => {
    const value = !showBuddies
    showTools && triggerFade()
    setShowBuddiesLocal(value)
    setTimeout(() => dispatch(toolsActions.switchShowBuddies()), duration)
    localStorage.setItem('contestFavList', value.toString())
  }

  // render styles and locales

  const { tableSearchMsg, tableClearBtn, tableOnlyWeekMsg, tableAllSeasonMsg, tableBuddiesMsg, tableAllUsersMsg } =
    i18n('standings') as LocaleType

  return (
    <div className="standings__tools animate-fade-in-up" ref={toolsRef}>
      <div className="standings__search">
        <Input
          onChange={hancleChangeSearch}
          value={standingsSearch}
          type="text"
          placeholder={tableSearchMsg}
          sx={{ width: '100%', height: '36px' }}
        />
        <div>
          <Button onClick={handleClearSearch} disabled={!standingsSearch} className={'standings__button'}>
            {tableClearBtn}
          </Button>
        </div>
      </div>
      <div className="standings__switchers" style={{ flexDirection: mobile ? 'column' : 'row' }}>
        <Switch
          onChange={handleSwitchShowOneWeek}
          checked={showOneWeek}
          messageOn={tableOnlyWeekMsg}
          messageOff={tableAllSeasonMsg}
          fullWidth={true}
        />
        <Switch
          onChange={handleSwitchBuddies}
          checked={showBuddiesLocal}
          messageOn={tableBuddiesMsg}
          messageOff={tableAllUsersMsg}
          fullWidth={true}
        />
      </div>
    </div>
  )
}
