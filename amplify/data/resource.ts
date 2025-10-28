import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3 Haiku'),
    systemPrompt: 'You are a helpful health assistant specializing in blood pressure management. Provide accurate, supportive information about blood pressure readings, lifestyle recommendations, and general health guidance. Always remind users to consult healthcare professionals for medical advice. Be supportive and encouraging while maintaining medical accuracy.',
  })
  .authorization((allow) => allow.owner()),
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Patient: a
    .model({
      userId: a.string(), // Optional: Cognito user ID as key
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string(), // Optional: store email for easy reference
      avatar: a.string(), // Optional: avatar selection (book, cat, dog, flower)
  gender: a.string(), // Optional: male or female
  isSmoker: a.boolean(), // Optional: smoker status
  dateOfBirth: a.string(), // Optional: patient date of birth
  height: a.float(), // Optional: height in cm
  weight: a.float(), // Optional: weight in kg
  exercisesDaily: a.boolean(), // Optional: exercises 30+ minutes daily
  language: a.string(), // Preferred language (en or pt)
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
