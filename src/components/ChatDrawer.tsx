
import React, { useState } from "react";
import { Drawer, IconButton, Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import { askAI } from "../askAI";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('hf_api_key') || null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const medicalKeywords = [
    'blood pressure', 'hypertension', 'hypotension', 'systolic', 'diastolic',
    'heart rate', 'pulse', 'cardiovascular', 'bp', 'mmhg', 'tachycardia', 'bradycardia',
    'arrhythmia', 'artery', 'vein', 'stroke', 'heart attack', 'cholesterol', 'atherosclerosis',
    'angioplasty', 'stent', 'atrial', 'ventricle', 'valve', 'myocardial', 'cardiac', 'circulation'
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: "You", text: input }]);
    setInput("");

    // Check for medical keywords (case-insensitive)
    const inputLower = input.toLowerCase();
    const hasMedicalKeyword = medicalKeywords.some(kw => inputLower.includes(kw));
    if (!hasMedicalKeyword) {
      setMessages(msgs => [
        ...msgs,
        {
          sender: "AI",
          text: "This assistant is focused on blood pressure and cardiovascular health. Please focus your question."
        }
      ]);
      return;
    }

    setLoading(true);
    if (!apiKey) {
      setShowApiKeyDialog(true);
      setLoading(false);
      return;
    }
    try {
      const aiResponse = await askAI(input, apiKey);
      setMessages(msgs => [...msgs, { sender: "AI", text: aiResponse }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: "AI", text: "Sorry, I couldn't get an answer right now." }]);
    }
    setLoading(false);
  };

  const handleApiKeySave = () => {
    setApiKey(apiKeyInput);
    localStorage.setItem('hf_api_key', apiKeyInput);
    setShowApiKeyDialog(false);
    setApiKeyInput("");
  };

  // Accessibility: blur focus when drawer/dialog closes
  const handleDrawerClose = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };
  const handleApiKeyDialogClose = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setShowApiKeyDialog(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{ sx: { width: { xs: 320, sm: 400 }, p: 0, bgcolor: '#f7fafc' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2, bgcolor: '#BE550F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Chat</Typography>
          <Box>
            <Tooltip title="Change API Key">
              <Button size="small" sx={{ color: '#fff', minWidth: 0, p: 0, mr: 1 }} onClick={() => setShowApiKeyDialog(true)}>
                🔑
              </Button>
            </Tooltip>
            <IconButton onClick={onClose} sx={{ color: '#fff' }}>
              ×
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem key={idx} alignItems="flex-start">
                <ListItemText
                  primary={<Typography sx={{ fontWeight: msg.sender === 'AI' ? 500 : 'bold', color: msg.sender === 'AI' ? '#BE550F' : undefined }}>{msg.sender}</Typography>}
                  secondary={msg.text}
                />
              </ListItem>
            ))}
            {loading && (
              <ListItem>
                <CircularProgress size={24} sx={{ color: '#BE550F', mr: 2 }} />
                <ListItemText primary={<Typography>AI is thinking...</Typography>} />
              </ListItem>
            )}
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
            disabled={!input.trim() || loading}
          >
            Send
          </Button>
  <Dialog open={showApiKeyDialog} onClose={handleApiKeyDialogClose}>
        <DialogTitle>Enter Hugging Face API Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Get a free API key at <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">huggingface.co</a> and paste it here.
          </Typography>
          <TextField
            label="Hugging Face API Key"
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApiKeyDialogClose}>Cancel</Button>
          <Button onClick={handleApiKeySave} disabled={!apiKeyInput.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
