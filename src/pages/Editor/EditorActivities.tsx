import { useSelector, useDispatch } from 'react-redux'

import { selectEditor } from '../../redux/selectors'
import { editorActions } from '../../redux/slices'
import { i18n, LocaleType } from '../../locale'
import { ChangeInputType } from '../../types'
import { Input } from '../../UI'

export const EditorActivities = () => {
  const dispatch = useDispatch()
  const { active } = useSelector(selectEditor)

  const handleChangeActivity = (e: ChangeInputType) => {
    const { checked } = e.target
    dispatch(editorActions.updateEditorActive(checked))
  }
  const { weekActivityMsg } = i18n('editor') as LocaleType

  return (
    <div className="editor-checkbox">
      <div className="editor-checkbox__pad">{weekActivityMsg}</div>
      <Input type="checkbox" checked={active} className={'editor-checkbox__box'} onChange={handleChangeActivity} />
    </div>
  )
}
