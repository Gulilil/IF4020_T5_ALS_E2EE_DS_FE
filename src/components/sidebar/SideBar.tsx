import { useState } from 'react'
import { Box, Divider, Button, CircularProgress } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ChatroomList from './ChatroomList'
import KeyDialog from './KeyDialog'
import { saveAs } from 'file-saver'
import useKey from '../../hooks/useKey'
import { useChat } from '../../context/ChatContext'
import useAuth from '../../hooks/useAuth'
import LoadingOverlay from '../LoadingOverlay'

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
    isGeneratingKey,
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
          <ChatroomList
            chatrooms={chatrooms || []}
            selectedChatroom={selectedChatroom}
            handleChatroomClick={handleChatroomClick}
            deleteChatroom={deleteChatroom}
          />
        )}
      </Box>
      <Divider className="bg-custom-chatroom-sidebar" />
      <Box className="p-4 bg-custom-chatroom-sidebar">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0a2434',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1c2b5d',
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
              backgroundColor: '#333333',
            },
            marginTop: '10px',
          }}
          fullWidth
          onClick={() => handleGenerateKey('E2EE')}
        >
          E2EE Key
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#222222',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
            marginTop: '10px',
          }}
          fullWidth
          onClick={() => handleGenerateKey('Schnorr')}
        >
          DS KEY
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#222222',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
            marginTop: '10px',
          }}
          fullWidth
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <KeyDialog
        open={openDialog}
        onClose={handleCloseDialog}
        dialogType={dialogType}
        privateE2EEKey={privateE2EEKey}
        publicE2EEKey={publicE2EEKey}
        privateSchnorrKey={privateSchnorrKey}
        publicSchnorrKey={publicSchnorrKey}
        handleDownloadKey={handleDownloadKey}
        isGeneratingKey={isGeneratingKey}
      />
    </div>
  )
}

export default Sidebar
