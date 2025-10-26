import React, { useState } from "react";
import { Drawer, IconButton, Box, Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const ChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { sender: "You", text: input }]);
      setInput("");
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          bgcolor: "#BE550F",
          color: "#fff",
          zIndex: 1300,
          boxShadow: 3,
          '&:hover': { bgcolor: "#9A4409" }
        }}
        size="large"
        aria-label="Open chat"
      >
        <ChatIcon fontSize="inherit" />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: 320, sm: 400 }, p: 0, bgcolor: '#f7fafc' } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, bgcolor: '#BE550F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Chat</Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff' }}>
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
    </>
  );
};

export default ChatDrawer;
