import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const useChatRedirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (username) {
      navigate(ROUTES.CHATS)
    }
  }, [navigate])
}

export default useChatRedirect
