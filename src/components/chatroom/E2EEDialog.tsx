import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material'
import React from 'react'
interface E2EEDialogPros {
  open: boolean
  handleClose: () => void
  activeStep: number
  handleNext: () => void
  handleBack: () => void
  e2eePrivateKey: string
  e2eePublicKey: string
  setE2eePrivateKey: React.Dispatch<React.SetStateAction<string>>
  setE2eePublicKey: React.Dispatch<React.SetStateAction<string>>

  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleKeySubmit: () => void
  keyFile: File | null
}
const E2EEDialog: React.FC<E2EEDialogPros> = ({
  open,
  handleClose,
  activeStep,
  handleNext,
  handleBack,
  e2eePrivateKey,
  e2eePublicKey,
  setE2eePrivateKey,
  setE2eePublicKey,
  handleFileInput,
  handleKeySubmit,
  keyFile,
}) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      }}
    >
      <DialogTitle>E2EE Cipher</DialogTitle>
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
            <StepLabel>Enter Your Private Key</StepLabel>
          </Step>
          <Step>
            <StepLabel>Enter Public Key</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <Box>
            <input
              type="file"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              id="private-key-file"
            />
            <label htmlFor="private-key-file">
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
                Upload Private Key File
              </Button>
            </label>
            <TextField
              label="Enter Private Key Manually"
              type="password"
              fullWidth
              value={e2eePrivateKey}
              onChange={(e) => setE2eePrivateKey(e.target.value)}
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
            <input
              type="file"
            //   accept=".scpriv"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              id="private-key-file"
            />
            <label htmlFor="private-key-file">
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
              label="Enter Private Key Manually"
              type="password"
              fullWidth
              value={e2eePublicKey}
              onChange={(e) => setE2eePublicKey(e.target.value)}
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
            disabled={!e2eePrivateKey && !keyFile}
          >
            Next
          </Button>
        )}
        {activeStep === 1 && (
          <Button onClick={handleKeySubmit} sx={{ color: '#000000' }}>
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default E2EEDialog
