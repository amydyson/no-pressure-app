import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
});

export interface BedrockMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateText(
  modelId: string,
  messages: BedrockMessage[]
): Promise<string> {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const params = {
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: formattedMessages,
      }),
    };

    const command = new InvokeModelCommand(params);
    const response = await bedrockClient.send(command);

    const decodedResponse = new TextDecoder().decode(response.body);
    const responseData = JSON.parse(decodedResponse);

    if (
      responseData.content &&
      responseData.content[0] &&
      responseData.content[0].text
    ) {
      return responseData.content[0].text;
    } else {
      throw new Error("Invalid response format from Bedrock");
    }
  } catch (error: any) {
    switch (error.name) {
      case "ResourceNotFoundException":
        throw new Error(
          "AI model not available. Please check if the service is enabled in your AWS region."
        );
      case "AccessDeniedException":
        throw new Error("Access denied. Please check IAM permissions.");
      case "ValidationException":
        throw new Error("Invalid request. Please try a different message.");
      default:
        throw new Error("Failed to get response. Please try again.");
    }
  }
}
