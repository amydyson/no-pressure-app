import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Backend configuration with AI/Bedrock permissions
 */
const backend = defineBackend({
  auth,
  data,
});

// Get the authenticated role from auth
const authenticatedRole = backend.auth.resources.authenticatedUserIamRole;

// Add Bedrock permissions to authenticated users
authenticatedRole.addToPrincipalPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    'bedrock:InvokeModel',
    'bedrock:InvokeModelWithResponseStream'
  ],
  resources: [
    'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307v1:0',
    'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229v1:0',
    'arn:aws:bedrock:*::foundation-model/anthropic.claude-instant-v1',
    'arn:aws:bedrock:*::foundation-model/amazon.titan-text-express-v1'
  ]
}));

// Export the backend configuration
export default backend;