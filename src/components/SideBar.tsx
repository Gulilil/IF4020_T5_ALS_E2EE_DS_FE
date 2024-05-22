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
import useKey from '../hooks/useKey'

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

  const {
    privateE2EEKey,
    publicE2EEKey,
    handleGenerateE2EEKey,
    privateSchnorrKey,
    publicSchnorrKey,
    handleGenerateSchnorrKey,
  } = useKey()

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'E2EE' | 'Schnorr'>('E2EE')

  const currentUser = localStorage.getItem('id') || 'user1'

  const handleGenerateKey = (type: 'E2EE' | 'Schnorr') => {
    if (type === 'E2EE') {
      handleGenerateE2EEKey()
    } else {
      handleGenerateSchnorrKey()
    }
    setDialogType(type)
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

  const handleDownloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, filename)
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
          onClick={() => handleGenerateKey('E2EE')}
        >
          Generate E2EE Key
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
          onClick={() => handleGenerateKey('Schnorr')}
        >
          Generate Schnorr Key
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
            sx={{ fontSize: '16px', fontWeight: 'bolder' }}
          >
            {dialogType === 'E2EE' ? 'E2EE Private Key' : 'Schnorr Private Key'}
          </DialogContentText>
          <DialogContentText
            sx={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
            }}
          >
            {dialogType === 'E2EE' ? privateE2EEKey : privateSchnorrKey}
          </DialogContentText>
          <DialogContentText
            sx={{ fontSize: '16px', fontWeight: 'bolder', marginTop: '1rem' }}
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
            {dialogType === 'E2EE' ? publicE2EEKey : publicSchnorrKey}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              handleDownloadKey(
                dialogType === 'E2EE' ? privateE2EEKey : privateSchnorrKey,
                dialogType === 'E2EE'
                  ? 'private_key.ecpriv'
                  : 'private_key.scpriv',
              )
            }
            color="primary"
          >
            Download Private Key
          </Button>
          <Button
            onClick={() =>
              handleDownloadKey(
                dialogType === 'E2EE' ? publicE2EEKey : publicSchnorrKey,
                dialogType === 'E2EE' ? 'public_key.ecpub' : 'public_key.scpub',
              )
            }
            color="primary"
          >
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
