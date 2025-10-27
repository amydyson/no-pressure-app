import React, { useState, useContext } from "react";
import { Drawer, IconButton, Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LanguageContext from "../LanguageContext";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const { language } = useContext(LanguageContext);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: language === 'pt' ? 'Você' : 'You', text: input }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: language === 'pt' ? 'IA' : 'AI', text: language === 'pt' ? 'Resposta simulada.' : 'Simulated response.' }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 320, sm: 400 }, p: 0, bgcolor: '#f7fafc' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2, bgcolor: '#BE550F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{language === 'pt' ? 'Conversa' : 'Chat'}</Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem key={idx} alignItems="flex-start">
                <ListItemText
                  primary={<Typography sx={{ fontWeight: msg.sender === (language === 'pt' ? 'IA' : 'AI') ? 500 : 'bold', color: msg.sender === (language === 'pt' ? 'IA' : 'AI') ? '#BE550F' : undefined }}>{msg.sender}</Typography>}
                  secondary={msg.text}
                />
              </ListItem>
            ))}
            {loading && (
              <ListItem>
                <CircularProgress size={24} sx={{ color: '#BE550F', mr: 2 }} />
                <ListItemText primary={<Typography>{language === 'pt' ? 'IA está pensando...' : 'AI is thinking...'}</Typography>} />
              </ListItem>
            )}
          </List>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={language === 'pt' ? 'Digite sua mensagem...' : 'Type your message...'}
            fullWidth
            size="small"
            sx={{ bgcolor: '#fff', borderRadius: 1 }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: '#BE550F', '&:hover': { bgcolor: '#9A4409' } }}
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            {language === 'pt' ? 'Enviar' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
