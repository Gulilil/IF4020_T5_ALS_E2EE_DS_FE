import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const useAuthRedirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (!username) {
      navigate(ROUTES.HOME)
    }
  }, [navigate])
}

export default useAuthRedirect
