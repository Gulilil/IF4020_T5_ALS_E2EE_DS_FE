import React from 'react'
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

interface SignatureDialogProps {
  open: boolean
  handleClose: () => void
  activeStep: number
  handleNext: () => void
  handleBack: () => void
  privateKey: string
  setPrivateKey: React.Dispatch<React.SetStateAction<string>>
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleKeySubmit: () => void
  keyFile: File | null
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  handleClose,
  activeStep,
  handleNext,
  handleBack,
  privateKey,
  setPrivateKey,
  handleFileInput,
  handleKeySubmit,
  keyFile,
}) => (
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
    <DialogTitle>Digital Signature</DialogTitle>
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
          <StepLabel>Enter Private Key</StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <Box>
          <input
            type="file"
            accept=".scpriv"
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
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
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
            label="Private Key"
            type="password"
            fullWidth
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
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
          disabled={!privateKey && !keyFile}
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

export default SignatureDialog
