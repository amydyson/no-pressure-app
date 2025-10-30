import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 400 } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2, bgcolor: '#BE550F', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flex: 1 }}>Chat</Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography>Chat functionality will go here</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;