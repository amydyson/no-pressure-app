import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true, // or username/phone depending on your setup
  },
  userAttributes: {
    'custom:role': {
      dataType: 'String',
      mutable: true, // allow updates after sign-up
    },
  },
});
