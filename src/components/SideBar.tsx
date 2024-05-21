import { ec as EC } from 'elliptic'
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import DeleteIcon from '@mui/icons-material/Delete'
import { useChat } from '../context/ChatContext'
import useAuth from '../hooks/useAuth'
import LoadingOverlay from '../components/LoadingOverlay'
import { useState } from 'react'
import { saveAs } from 'file-saver'

const Sidebar: React.FC = () => {
  const { handleLogout } = useAuth()
  const {
    chatrooms,
    selectedChatroom,
    setSelectedChatroom,
    joinRealTimeQueue,
    deleteChatroom,
    loading,
    waitingForMatch,
    setIsRealTime,
  } = useChat()
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPulicKey] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const currentUser = localStorage.getItem('id') || 'user1'

  const handleGenerateKey = () => {
    const ec = new EC('secp256k1')
    const key = ec.genKeyPair()
    const privateKey = key.getPrivate()
    const publicKey = key.getPublic()
    setPrivateKey(privateKey.toString('hex'))
    setPulicKey(publicKey.encode('hex', false))
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleJoinRealTimeQueue = () => {
    setSelectedChatroom(null)
    setIsRealTime(true)
    joinRealTimeQueue(currentUser)
  }

  const handleChatroomClick = (chatroomId: number) => {
    setSelectedChatroom(chatroomId)
    setIsRealTime(false)
  }
  const handleDownloadPrivateKey = () => {
    const blob = new Blob([privateKey], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'private_key.ecpriv')
  }

  const handleDownloadPublicKey = () => {
    const blob = new Blob([publicKey], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'public_key.ecpub')
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
                  onClick={() => handleChatroomClick(chatroom.chatroomId)}
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
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#222222',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#777777',
            },
            marginTop: '10px',
          }}
          fullWidth
          onClick={handleGenerateKey}
        >
          Generate Key
        </Button>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="key-dialog-title"
        aria-describedby="key-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="key-dialog-title">Generated Keys</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="key-dialog-description"
            sx={{
              fontSize: '16px',
              fontWeight: 'bolder',
            }}
          >
            Private Key
          </DialogContentText>
          <DialogContentText
            sx={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
            }}
          >
            {privateKey}
          </DialogContentText>
          <DialogContentText
            id="key-dialog-description"
            sx={{
              fontSize: '16px',
              fontWeight: 'bolder',
              marginTop: '1rem',
            }}
          >
            Public Key
          </DialogContentText>
          <DialogContentText
            sx={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
            }}
          >
            {publicKey}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadPrivateKey} color="primary">
            Download Private Key
          </Button>
          <Button onClick={handleDownloadPublicKey} color="primary">
            Download Public Key
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Sidebar
