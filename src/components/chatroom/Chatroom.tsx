import React, { useState } from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import SignatureDialog from './SignatureDialog'
import useKey from '../../hooks/useKey'
import { useChat } from '../../context/ChatContext'
import { generateDigitalSignature } from '../../utils/schnorr'

const Chatroom: React.FC = () => {
  const {
    selectedChatroom,
    messages,
    addRealTimeMessage,
    receiverId,
    isRealTime,
  } = useChat()
  const { schnorrParams } = useKey()
  const [message, setMessage] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [privateKey, setPrivateKey] = useState<string>('')
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [isSigning, setIsSigning] = useState<boolean>(false)

  const currentUser = localStorage.getItem('id') || 'user1'

  const handleSendMessage = (signature?: string) => {
    if (
      message.trim() &&
      selectedChatroom !== null &&
      receiverId &&
      isRealTime
    ) {
      addRealTimeMessage(
        selectedChatroom,
        message,
        currentUser,
        receiverId,
        !!signature,
        signature,
      )
      setMessage('')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setActiveStep(0)
    setPrivateKey('')
    setKeyFile(null)
  }

  const handleKeySubmit = async () => {
    if (privateKey.trim() && schnorrParams) {
      const signature = await generateDigitalSignature(
        message,
        privateKey,
        schnorrParams,
      )
      setPrivateKey('')
      setOpen(false)
      handleSendMessage(JSON.stringify(signature))
    } else {
      console.error(
        'Private key is empty or Schnorr parameters are not initialized',
      )
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const content = event.target?.result as string
        setPrivateKey(content)
      }
      fileReader.readAsText(e.target.files[0])
      setKeyFile(e.target.files[0])
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleMessageSend = async () => {
    if (isSigning) {
      setOpen(true)
    } else {
      handleSendMessage()
    }
  }

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleMessageSend()
    }
  }

  if (selectedChatroom === null) {
    return (
      <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
        No chatroom selected
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <AppBar position="static" sx={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar>
          <Typography variant="h6" className="text-white flex-1">
            {`Chatroom ${selectedChatroom}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <MessageList
        messages={messages[selectedChatroom] || []}
        currentUser={currentUser}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        handleKeyPress={handleKeyPress}
        handleMessageSend={handleMessageSend}
        isRealTime={isRealTime}
        isSigning={isSigning}
        setIsSigning={setIsSigning}
      />
      <SignatureDialog
        open={open}
        handleClose={handleClose}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        handleFileInput={handleFileInput}
        handleKeySubmit={handleKeySubmit}
        keyFile={keyFile}
      />
    </div>
  )
}

export default Chatroom