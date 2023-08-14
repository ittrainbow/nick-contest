import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector } from 'react-redux'

import { selectApp } from '../redux/selectors'
import { auth } from '../db/firebase'
import { Login, Dashboard } from '.'
import { Loader } from '../UI'

export const UserPage = () => {
  const [user] = useAuthState(auth)
  const { loading } = useSelector(selectApp)

  return loading ? <Loader /> : user ? <Dashboard /> : <Login />
}
