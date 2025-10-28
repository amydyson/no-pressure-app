import React, { useState, useContext, useRef, useEffect } from "react";
import { Drawer, Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LanguageContext from "../../LanguageContext";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "../../../amplify/data/resource";

// const client = generateClient<Schema>();

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const { language } = useContext(LanguageContext);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.toLowerCase();
    setMessages(msgs => [...msgs, { sender: language === 'pt' ? 'Você' : 'You', text: input }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      let response = '';
      
      if (userMessage.includes('systolic') || userMessage.includes('sistólica')) {
        response = language === 'pt' 
          ? 'A pressão sistólica é o número superior na sua leitura de pressão arterial. Representa a pressão quando seu coração bate e bombeia sangue. Valores normais ficam abaixo de 120 mmHg.' 
          : 'Systolic pressure is the top number in your blood pressure reading. It represents the pressure when your heart beats and pumps blood. Normal values are below 120 mmHg.';
      } else if (userMessage.includes('diastolic') || userMessage.includes('diastólica')) {
        response = language === 'pt'
          ? 'A pressão diastólica é o número inferior. Representa a pressão quando seu coração relaxa entre as batidas. Valores normais ficam abaixo de 80 mmHg.'
          : 'Diastolic pressure is the bottom number. It represents the pressure when your heart relaxes between beats. Normal values are below 80 mmHg.';
      } else if (userMessage.includes('exercise') || userMessage.includes('exercício')) {
        response = language === 'pt'
          ? 'Exercícios regulares são ótimos para a pressão arterial! Caminhadas de 30 minutos, natação ou ciclismo podem reduzir a pressão em 4-9 mmHg. Comece devagar e aumente gradualmente.'
          : 'Regular exercise is great for blood pressure! 30-minute walks, swimming, or cycling can lower pressure by 4-9 mmHg. Start slowly and gradually increase.';
      } else {
        const responses = language === 'pt' ? [
          'Que pergunta interessante! A pressão arterial é influenciada por muitos fatores como dieta, exercícios e estresse.',
          'Boa pergunta! Manter um peso saudável e reduzir o sódio podem ajudar muito com a pressão arterial.',
          'Interessante! O estresse pode aumentar temporariamente a pressão. Técnicas de relaxamento como meditação podem ajudar.'
        ] : [
          'Great question! Blood pressure is influenced by many factors like diet, exercise, and stress levels.',
          'Good question! Maintaining a healthy weight and reducing sodium can really help with blood pressure.',
          'Interesting! Stress can temporarily raise blood pressure. Relaxation techniques like meditation can help.'
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      setMessages(msgs => [...msgs, { sender: language === 'pt' ? 'IA' : 'AI', text: response }]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

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
          <Box ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={language === 'pt' ? 'Faça uma pergunta sobre pressão arterial' : 'Ask a question about blood pressure'}
            fullWidth
            size="medium"
            multiline
            minRows={2}
            maxRows={6}
            sx={{ bgcolor: '#fff', borderRadius: 1, fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.03em' }}
            InputProps={{ style: { fontWeight: 700, fontSize: '1.25rem', color: '#1a1a1a', letterSpacing: '0.03em' } }}
            inputProps={{ style: { fontWeight: 700, fontSize: '1.25rem', color: '#1a1a1a', letterSpacing: '0.03em' } }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: '#BE550F', '&:hover': { bgcolor: '#9A4409' }, minWidth: 36, height: 44, px: 1.5, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', mt: 1 }}
            onClick={handleSend}
            disabled={!input.trim() || loading}
            fullWidth
          >
            {language === 'pt' ? 'Enviar' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;