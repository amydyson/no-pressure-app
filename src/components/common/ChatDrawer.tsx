import React, { useState, useContext, useRef, useEffect } from "react";
import { Drawer, Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LanguageContext from "../../LanguageContext";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
// Assuming you have imported and configured Amplify elsewhere (e.g., index.ts/App.tsx)

const client = generateClient<Schema>();

interface ChatDrawerProps {
    open: boolean;
    onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
    const { language } = useContext(LanguageContext);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    // NEW: State to track if the initial conversation object is being created
    const [isInitializing, setIsInitializing] = useState(true); 
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Function to handle the actual API call to send a message
    const sendMessage = async (message: string) => {
        // NOTE: The 'as any' is a temporary fix for type issues. 
        // Ensure your Schema type is fully defined to remove it later.
        return await (client as any).conversations.chat.sendMessage({
            conversationId,
            content: [{ text: message }]
        });
    };

    // NEW: Function to create a conversation and get its ID
    const initializeConversation = async () => {
        setIsInitializing(true);
        console.log('Attempting to create or retrieve a conversation...');
        
        // IMPORTANT: This operation requires an authenticated user.
        try {
            // Call the Amplify Data client's create method for the 'chat' conversation route
            const { data: newChat, errors } = await (client as any).conversations.chat.create({});

            if (errors) {
                console.error('Error creating conversation:', errors);
                // Throwing an error will ensure the catch block is hit later
                throw new Error(errors[0]?.message || 'Failed to create conversation object.');
            }

            setConversationId(newChat.id);
            console.log('Conversation initialized with ID:', newChat.id);
        } catch (error) {
            console.error('Conversation Initialization Failed. Check user login and backend schema.', error);
            // Optionally, push an error message to the chat
            setMessages(msgs => [...msgs, {
                sender: language === 'pt' ? 'IA' : 'AI',
                text: language === 'pt' ? 'Falha ao iniciar o serviço de IA. Certifique-se de estar logado.' : 'Failed to start AI service. Please ensure you are logged in.'
            }]);
        } finally {
            setIsInitializing(false);
        }
    };

    // UseEffect to manage conversation initialization when the drawer opens
    useEffect(() => {
        if (open && !conversationId) {
            initializeConversation();
        }
        // You might clear the conversationId here if you want a fresh chat every time it closes:
        // if (!open) { setConversationId(null); }
    }, [open]);

    const handleSend = async () => {
        // Check both input and the newly created conversationId
        if (!input.trim() || !conversationId) return; 
        
        const userMessage = input;
        setMessages(msgs => [...msgs, { sender: language === 'pt' ? 'Você' : 'You', text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            // The sendMessage function is now guaranteed to have a conversationId
            const response = await sendMessage(userMessage);
            
            // Extract the AI response from the structure
            const aiResponse = response?.content?.[0]?.text || (language === 'pt' ? 'Desculpe, não consegui processar sua mensagem.' : 'Sorry, I could not process your message.');
            
            setMessages(msgs => [...msgs, { sender: language === 'pt' ? 'IA' : 'AI', text: aiResponse }]);

        } catch (error) {
            // CRUCIAL: Log the specific error for debugging
            console.error('Error sending message:', error);
            setMessages(msgs => [...msgs, { 
                sender: language === 'pt' ? 'IA' : 'AI', 
                text: language === 'pt' ? 'O serviço de IA falhou. Verifique o console.' : 'AI service failed. Check the console for details.' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    const sendButtonText = isInitializing 
        ? (language === 'pt' ? 'Conectando IA...' : 'Connecting AI...')
        : (language === 'pt' ? 'Enviar' : 'Send');

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
                        <IconButton aria-label="close" onClick={onClose} size="large" sx={{ color: '#fff', width: 40, height: 40, m: 0, p: 0, position: 'absolute', top: 0, right: 0 }}>
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
                        {/* Show loading indicator for message response or initialization */}
                        {(loading || isInitializing) && (
                            <ListItem>
                                <CircularProgress size={24} sx={{ color: '#BE550F', mr: 2 }} />
                                <ListItemText primary={<Typography>{loading ? (language === 'pt' ? 'IA está pensando...' : 'AI is thinking...') : (language === 'pt' ? 'Iniciando Conversa...' : 'Starting Conversation...')}</Typography>} />
                            </ListItem>
                        )}
                    </List>
                    <Box ref={messagesEndRef} />
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !loading && !isInitializing) handleSend(); }}
                        placeholder={language === 'pt' ? 'Faça uma pergunta sobre pressão arterial' : 'Ask a question about blood pressure'}
                        fullWidth
                        size="medium"
                        multiline
                        minRows={2}
                        maxRows={6}
                        sx={{ bgcolor: '#fff', borderRadius: 1 }}
                        InputProps={{ style: { fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', letterSpacing: '0.03em' } }}
                        inputProps={{ style: { fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', letterSpacing: '0.03em' } }}
                        disabled={loading || isInitializing} // Disable input while loading/initializing
                    />
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#BE550F', '&:hover': { bgcolor: '#9A4409' }, minWidth: 36, height: 44, px: 1.5, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', mt: 1 }}
                        onClick={handleSend}
                        // Disable button if input is empty OR if AI is busy OR if conversation is initializing
                        disabled={!input.trim() || loading || isInitializing} 
                        fullWidth
                    >
                        {sendButtonText}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default ChatDrawer;