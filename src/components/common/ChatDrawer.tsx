
import React, { useContext } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LanguageContext from "../../LanguageContext";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const { language } = useContext(LanguageContext);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 420 }, boxShadow: 3, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, bgcolor: '#f9f9f9', overflowX: 'hidden' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2, bgcolor: '#BE550F', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flex: 1, textAlign: 'left' }}>{language === 'pt' ? 'Conversa' : 'Chat'}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 0, m: 0, width: 40, height: 40, position: 'relative' }}>
            <IconButton aria-label="close" onClick={onClose} size="large" sx={{ color: '#888', width: 40, height: 40, m: 0, p: 0, position: 'absolute', top: 0, right: 0 }}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <AIConversation client={client} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;