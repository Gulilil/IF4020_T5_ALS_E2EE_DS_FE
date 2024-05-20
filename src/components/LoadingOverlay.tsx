import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ className }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bgcolor="rgba(0, 0, 0, 0.8)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      zIndex={9999}
      sx={{
        transition: 'opacity 0.5s ease-out',
        opacity: 1,
        '&.fade-out': {
          opacity: 0,
        },
      }}
      className={className}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h5" color="inherit" mt={2}>
        Waiting for another user to join...
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
