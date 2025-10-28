import { Authenticator, Flex } from '@aws-amplify/ui-react';
import type { Schema } from './schema';
import './../app/app.css';
import { Amplify } from 'aws-amplify';
import '@aws-amplify-ui-react/styles.css';
import outputs from '../../amplify/outputs.json';
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { generateClient } from 'aws-amplify/api';
Amplify.configure(outputs)

const client =  generateClient<Schema>();

export default function AITest() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Flex direction="column" height="100vh">
          <AIConversation
            agent={{
              type: "chat",
              client,
            }}
            user={user}
            onSignOut={signOut}
          />
        </Flex>
      )}
    </Authenticator>
  );
}