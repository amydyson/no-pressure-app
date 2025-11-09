import React, { useState } from "react";
import { Drawer, Box, Typography, IconButton, TextField, Button, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Define the message interface to match BedrockMessage
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to conversation
    const newUserMessage: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      const { generateText } = await import('../../utils/bedrock-service');
      
      // Format messages for Bedrock - ensure proper typing
      const formattedMessages: Message[] = [
        ...messages.slice(-5), // Keep last 5 messages for context
        newUserMessage
      ];
      
      // Generate AI response using Bedrock
      const response = await generateText('anthropic.claude-3-haiku-20240307v1:0', formattedMessages);
      
      // Add AI response to conversation
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI conversation error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${error.message}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        
        {/* Conversation Area */}
        <Box sx={{ flex: 1, p: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
              <Typography variant="body1" gutterBottom>
                Start a conversation
              </Typography>
              <Typography variant="body2">
                Ask me anything and I'll help!
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2,
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.role === 'user' ? '#BE550F' : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    wordWrap: 'break-word'
                  }}
                >
                  {message.content}
                </Typography>
              </Box>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
              <Typography 
                variant="body2"
                sx={{ 
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'grey.100',
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CircularProgress size={16} sx={{ mr: 1 }} />
                AI is thinking...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <Button 
              variant="contained" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              sx={{ 
                bgcolor: '#BE550F',
                '&:hover': {
                  bgcolor: '#a0440d',
                },
                minWidth: 'auto',
                px: 2
              }}
            >
              {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;