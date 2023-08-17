import { useSelector } from 'react-redux'

import { selectAnswers, selectCompare, selectUser } from '../redux/selectors'
import { getObjectsEquality } from '../helpers'

export const useChanges = () => {
  const { uid } = useSelector(selectUser)
  const answers = useSelector(selectAnswers)
  const compare = useSelector(selectCompare)
  if (answers) {
    const userChanges = !getObjectsEquality(answers[uid], compare)
    return userChanges
  }

  return false
}
