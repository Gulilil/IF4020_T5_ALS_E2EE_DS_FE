import React, { useState } from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import MessageList, { decryptIncomingMessage } from './MessageList'
import MessageInput from './MessageInput'
import SignatureDialog from './SignatureDialog'
import SignatureVerificationDialog from './SignatureVerificationDialog'
import { Message } from '../../dto/socket'
import { useChat } from '../../context/ChatContext'
import useKey from '../../hooks/useKey'
import {
  generateDigitalSignature,
  verifyDigitalSignature,
} from '../../utils/schnorr'
import E2EEDialog from './E2EEDialog'

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
  const [openE2eeDialog, setOpenE2eeDialog] = useState<boolean>(true)
  const [verificationOpen, setVerificationOpen] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [privateKey, setPrivateKey] = useState<string>('')
  const [, setPublicKey] = useState<string>('')
  const [senderPrivateKey, setSenderPrivateKey] = useState<string>('')
  const [receiverPublicKey, setReceiverPublicKey] = useState<string>('')
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const currentUser = localStorage.getItem('id') || 'user1'

  const handleSendMessage = (signature?: string) => {
    if (
      message.trim() &&
      selectedChatroom !== null &&
      receiverId &&
      isRealTime
    ) {
      console.log("send")
      addRealTimeMessage(
        selectedChatroom,
        message,
        currentUser,
        receiverId,
        !!signature,
        signature,
        receiverPublicKey,
      )
      setMessage('')
    }
  }
  const handleCloseE2ee = () => {
    setOpenE2eeDialog(false)
    setActiveStep(0)
    setReceiverPublicKey('')
    setKeyFile(null)
  }
  const handleClose = () => {
    setOpen(false)
    setActiveStep(0)
    setPrivateKey('')
    setKeyFile(null)
  }

  const handleVerificationClose = () => {
    setVerificationOpen(false)
    setActiveStep(0)
    setPublicKey('')
    setKeyFile(null)
  }

  const hanldeKeyE2eeSubmit = () => {
    console.log(receiverPublicKey)
    setOpenE2eeDialog(false)
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

  const handleVerificationSubmit = async (publicKey: string) => {
    if (selectedMessage && publicKey.trim() && schnorrParams) {
      const isValid = await verifyDigitalSignature(
        decryptIncomingMessage(senderPrivateKey, selectedMessage.hashedMessage, selectedMessage.ecegVal).trim(),
        selectedMessage.signature,
        publicKey,
        schnorrParams,
      )
      if (isValid) {
        alert('Signature is valid')
      } else {
        alert('Signature is invalid')
      }
    } else {
      console.error(
        'Public key is empty or Schnorr parameters are not initialized',
      )
    }
  }

  const handleFileInputE2ee = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const content = event.target?.result as string
        activeStep === 0
          ? setSenderPrivateKey(content)
          : setReceiverPublicKey(content)
      }
      fileReader.readAsText(e.target.files[0])
      setKeyFile(e.target.files[0])
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

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    setVerificationOpen(true)
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
        onMessageClick={handleMessageClick}
        privateKey={senderPrivateKey}
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
      <SignatureVerificationDialog
        open={verificationOpen}
        handleClose={handleVerificationClose}
        handleVerify={handleVerificationSubmit}
      />
      <E2EEDialog
        open={openE2eeDialog}
        activeStep={activeStep}
        handleClose={handleCloseE2ee}
        handleNext={handleNext}
        handleBack={handleBack}
        e2eePrivateKey={senderPrivateKey}
        e2eePublicKey={receiverPublicKey}
        setE2eePrivateKey={setSenderPrivateKey}
        setE2eePublicKey={setReceiverPublicKey}
        handleFileInput={handleFileInputE2ee}
        handleKeySubmit={hanldeKeyE2eeSubmit}
        keyFile={keyFile}
      />
    </div>
  )
}

export default Chatroom
