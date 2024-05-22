import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
} from '@mui/material'

interface SignatureVerificationDialogProps {
  open: boolean
  handleClose: () => void
  handleVerify: (publicKey: string) => void
}

const SignatureVerificationDialog: React.FC<
  SignatureVerificationDialogProps
> = ({ open, handleClose, handleVerify }) => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [publicKey, setPublicKey] = useState<string>('')
  const [keyFile, setKeyFile] = useState<File | null>(null)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const content = event.target?.result as string
        setPublicKey(content)
      }
      fileReader.readAsText(e.target.files[0])
      setKeyFile(e.target.files[0])
    }
  }

  const handleKeySubmit = () => {
    handleVerify(publicKey)
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      }}
    >
      <DialogTitle>Verify Digital Signature</DialogTitle>
      <DialogContent>
        <Stepper
          activeStep={activeStep}
          sx={{
            paddingTop: '16px',
            paddingBottom: '16px',
            '& .MuiStepIcon-root': {
              color: '#000000',
              '&.Mui-active': {
                color: '#000000',
              },
              '&.Mui-completed': {
                color: '#000000',
              },
            },
            '& .MuiStepLabel-label': {
              color: '#000000',
            },
          }}
        >
          <Step>
            <StepLabel>Select Key Source</StepLabel>
          </Step>
          <Step>
            <StepLabel>Enter Public Key</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <Box>
            <input
              type="file"
              accept=".scpub"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              id="public-key-file"
            />
            <label htmlFor="public-key-file">
              <Button
                variant="contained"
                component="span"
                sx={{
                  backgroundColor: '#222222',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                  marginTop: '16px',
                  marginBottom: '16px',
                }}
              >
                Upload Public Key File
              </Button>
            </label>
            <TextField
              label="Or Enter Public Key Manually"
              type="text"
              fullWidth
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              margin="normal"
              InputProps={{
                sx: {
                  color: '#000000',
                },
              }}
              InputLabelProps={{
                sx: {
                  color: '#000000',
                },
              }}
            />
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <TextField
              autoFocus
              margin="dense"
              label="Public Key"
              type="text"
              fullWidth
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              InputProps={{
                sx: {
                  color: '#000000',
                },
              }}
              InputLabelProps={{
                sx: {
                  color: '#000000',
                },
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {activeStep === 1 && (
          <Button onClick={handleBack} sx={{ color: '#000000' }}>
            Back
          </Button>
        )}
        <Button onClick={handleClose} sx={{ color: '#000000' }}>
          Cancel
        </Button>
        {activeStep === 0 && (
          <Button
            onClick={handleNext}
            sx={{ color: '#000000' }}
            disabled={!publicKey && !keyFile}
          >
            Next
          </Button>
        )}
        {activeStep === 1 && (
          <Button onClick={handleKeySubmit} sx={{ color: '#000000' }}>
            Verify
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default SignatureVerificationDialog
