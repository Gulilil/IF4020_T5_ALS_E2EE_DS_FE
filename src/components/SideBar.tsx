import {
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import DeleteIcon from '@mui/icons-material/Delete'
import { useChat } from '../context/ChatContext'
import useAuth from '../hooks/useAuth'
import LoadingOverlay from '../components/LoadingOverlay'

const Sidebar: React.FC = () => {
  const { handleLogout } = useAuth()
  const {
    chatrooms,
    selectedChatroom,
    setSelectedChatroom,
    joinQueue,
    joinRealTimeQueue,
    deleteChatroom,
    loading,
    waitingForMatch,
  } = useChat()

  const currentUser = localStorage.getItem('id') || 'user1'

  const handleJoinQueue = (chatroomId: number) => {
    joinQueue(currentUser, chatroomId)
  }

  const handleJoinRealTimeQueue = () => {
    setSelectedChatroom(null)
    joinRealTimeQueue(currentUser)
  }

  return (
    <div className="w-60 h-full bg-gray-900 text-white flex flex-col">
      {waitingForMatch && <LoadingOverlay />}
      <Box className="flex-1 overflow-y-auto bg-custom-chatroom-sidebar">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <List>
            {chatrooms && chatrooms.length > 0 ? (
              chatrooms.map((chatroom) => (
                <ListItem
                  button
                  key={chatroom.chatroomId}
                  onClick={() => {
                    setSelectedChatroom(chatroom.chatroomId)
                    handleJoinQueue(chatroom.chatroomId)
                  }}
                  selected={chatroom.chatroomId === selectedChatroom}
                  className={`hover:bg-gray-700 ${chatroom.chatroomId === selectedChatroom ? 'bg-gray-800' : ''}`}
                >
                  <ListItemText primary={chatroom.name} />
                  {chatroom.isRemovable && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteChatroom(chatroom.chatroomId)}
                        sx={{
                          color: 'white',
                          '&:hover': {
                            color: 'red',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No chatrooms available" />
              </ListItem>
            )}
          </List>
        )}
      </Box>
      <Divider className="bg-custom-chatroom-sidebar" />
      <Box className="p-4 bg-custom-chatroom-sidebar">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#222222',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
          fullWidth
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#a54d06',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#777777',
            },
            marginTop: '10px',
          }}
          fullWidth
          onClick={handleJoinRealTimeQueue}
          disabled={waitingForMatch}
        >
          Join Real-Time Queue
        </Button>
      </Box>
    </div>
  )
}

export default Sidebar
