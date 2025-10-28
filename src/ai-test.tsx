import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const AiTest: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResponse(data?.result || JSON.stringify(data));
    } catch (err) {
      setError((err as Error).message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>AI Chat Test</Typography>
        <TextField
          label="Ask something"
          value={input}
          onChange={e => setInput(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
        {response && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">AI Response:</Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>{response}</Paper>
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AiTest;
