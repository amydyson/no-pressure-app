import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Create Bedrock client - it will use the same credentials as Amplify
const bedrockClient = new BedrockRuntimeClient({ 
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1' 
});

export interface BedrockMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateText(modelId: string, messages: BedrockMessage[]): Promise<string> {
  try {
    console.log('Sending to Bedrock:', { modelId, messages });
    
    // Format the messages for Claude
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const params = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: formattedMessages
      })
    };

    const command = new InvokeModelCommand(params);
    const response = await bedrockClient.send(command);
    
    // Decode the response
    const decodedResponse = new TextDecoder().decode(response.body);
    const responseData = JSON.parse(decodedResponse);
    
    console.log('Bedrock response:', responseData);
    
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      return responseData.content[0].text;
    } else {
      throw new Error('Invalid response format from Bedrock');
    }
  } catch (error: any) {
    console.error('Bedrock service error:', error);
    
    // Provide user-friendly error messages
    if (error.name === 'ResourceNotFoundException') {
      throw new Error('AI model not available. Please check if Bedrock is enabled in your AWS region.');
    } else if (error.name === 'AccessDeniedException') {
      throw new Error('Access denied to Bedrock. Please check IAM permissions.');
    } else if (error.name === 'ValidationException') {
      throw new Error('Invalid request to AI service. Please try a different message.');
    } else {
      throw new Error('Failed to get AI response. Please try again.');
    }
  }
}