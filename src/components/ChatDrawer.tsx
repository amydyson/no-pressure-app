
import React, { useState } from "react";
import { Drawer, IconButton, Box, Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { sender: "You", text: input }]);
      setInput("");
    }
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
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            ×
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem key={idx} alignItems="flex-start">
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 'bold' }}>{msg.sender}</Typography>}
                  secondary={msg.text}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type your message..."
            fullWidth
            size="small"
            sx={{ bgcolor: '#fff', borderRadius: 1 }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: '#BE550F', '&:hover': { bgcolor: '#9A4409' } }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
