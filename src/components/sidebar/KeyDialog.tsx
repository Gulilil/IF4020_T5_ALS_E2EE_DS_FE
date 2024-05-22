import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material'

interface KeyDialogProps {
  open: boolean
  onClose: () => void
  dialogType: 'E2EE' | 'Schnorr'
  privateE2EEKey: string
  publicE2EEKey: string
  privateSchnorrKey: string
  publicSchnorrKey: string
  handleDownloadKey: (key: string, filename: string) => void
  isGeneratingKey: boolean
}

const KeyDialog: React.FC<KeyDialogProps> = ({
  open,
  onClose,
  dialogType,
  privateE2EEKey,
  publicE2EEKey,
  privateSchnorrKey,
  publicSchnorrKey,
  handleDownloadKey,
  isGeneratingKey,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="key-dialog-title"
      aria-describedby="key-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="key-dialog-title">Generated Keys</DialogTitle>
      <DialogContent dividers>
        {isGeneratingKey ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
      {!isGeneratingKey && (
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
            sx={{
              backgroundColor: '#222222',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
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
            sx={{
              backgroundColor: '#222222',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Download Public Key
          </Button>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: '#222222',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default KeyDialog
