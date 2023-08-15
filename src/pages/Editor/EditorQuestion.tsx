import { FaEdit, FaTrashAlt, FaBan } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment/moment'

import { selectApp, selectEditor } from '../../redux/selectors'
import { FadeRefType, QuestionsType } from '../../types'
import { editorActions } from '../../redux/slices'
import { useFade } from '../../hooks'

type QuestionPropsType = { id: number; questionsRef: FadeRefType }

export const EditorQuestion = ({ id, questionsRef }: QuestionPropsType) => {
  const dispatch = useDispatch()
  const { questions, questionInWork } = useSelector(selectEditor)
  const { duration } = useSelector(selectApp)
  const { away, home, deadline, score } = questions[id]

  // animate

  const { triggerFade } = useFade({ ref: questionsRef })

  // helpers

  const drawDeadline = (deadline: number) =>
    moment(deadline)
      .format()
      .substring(4, 16)
      .split('T')
      .join(' ')
      .replace('-07-', ' Jul ')
      .replace('-08-', ' Aug ')
      .replace('-09-', ' Sep ')
      .replace('-10-', ' Oct ')
      .replace('-11-', ' Nov ')
      .replace('-12-', ' Dec ')
      .replace('-01-', ' Jan ')

  // action handlers

  const handleEditQuestion = (id: number) => {
    triggerFade()
    const { away, home, total, deadline } = questions[id]
    dispatch(editorActions.setQuestionInWork({ away, home, total, id, deadline, score }))
    dispatch(editorActions.setQuestionCompare({ away, home, total, id, deadline, score }))
  }

  const handleDeleteQuestion = (id: number) => {
    triggerFade()
    setTimeout(() => {
      const obj: QuestionsType = structuredClone(questions)
      delete obj[id]
      dispatch(editorActions.updateEditorQuestions(obj))
    }, duration)
  }

  const handleClearQuestion = () => {
    dispatch(editorActions.clearQuestionInWork())
  }

  return (
    <div className="editor-question">
      <div className="editor-question__desc">
        {away} @ {home} {score}
      </div>
      <div>{drawDeadline(deadline)}</div>
      <div className="editor-question__buttons">
        {id === questionInWork.id ? (
          <FaBan className="editor-question__edit editor-btn__green faBan" onClick={handleClearQuestion} />
        ) : (
          <FaEdit className="editor-question__edit editor-btn__green" onClick={() => handleEditQuestion(id)} />
        )}
        <FaTrashAlt className="editor-question__trash editor-btn__red" onClick={() => handleDeleteQuestion(id)} />
      </div>
    </div>
  )
}
