import React, { useContext } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import LanguageContext from "../../LanguageContext";

const client = generateClient<Schema>({
  authMode: 'userPool',
});

const { useAIConversation } = createAIHooks(client);

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const { language } = useContext(LanguageContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');

  React.useEffect(() => {
    console.log('Messages:', messages);
    console.log('IsLoading:', isLoading);
    messages.forEach((msg, idx) => {
      console.log(`Message ${idx}:`, {
        role: msg.role,
        content: msg.content,
        isLoading: (msg as any).isLoading,
        id: msg.id,
      });
    });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    console.log('Sending message:', text);
    try {
      await sendMessage({ content: [{ text }] });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 400 } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            p: 2,
            bgcolor: "#BE550F",
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ flex: 1 }}>
            {language === 'pt' ? 'Conversa' : 'Chat'}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {/* Display messages */}
          {messages.map((message, index) => {
            const messageLoading = (message as any).isLoading;
            return (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                  {message.role === 'user' ? (language === 'pt' ? 'Você' : 'You') : (language === 'pt' ? 'IA' : 'AI')}
                </Typography>
                <Typography>
                  {message.content.map((content: any) => content.text || '').join('') || 
                    (messageLoading ? (language === 'pt' ? 'Pensando...' : 'Thinking...') : (language === 'pt' ? 'Sem resposta' : 'No response'))}
                </Typography>
              </Box>
            );
          })}
          {isLoading && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {language === 'pt' ? 'IA está pensando...' : 'AI is thinking...'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem('message') as HTMLInputElement;
              if (input.value.trim()) {
                handleSendMessage(input.value);
                input.value = '';
              }
            }}
            sx={{ display: 'flex', gap: 1 }}
          >
            <input
              name="message"
              type="text"
              placeholder={language === 'pt' ? 'Digite sua mensagem...' : 'Type your message...'}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#BE550F',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {language === 'pt' ? 'Enviar' : 'Send'}
            </button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;

