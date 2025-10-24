/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePatient = /* GraphQL */ `subscription OnCreatePatient(
  $filter: ModelSubscriptionPatientFilterInput
  $owner: String
) {
  onCreatePatient(filter: $filter, owner: $owner) {
    bloodPressure
    createdAt
    dateOfBirth
    height
    id
    name
    owner
    updatedAt
    weight
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePatientSubscriptionVariables,
  APITypes.OnCreatePatientSubscription
>;
export const onCreateTodo = /* GraphQL */ `subscription OnCreateTodo(
  $filter: ModelSubscriptionTodoFilterInput
  $owner: String
) {
  onCreateTodo(filter: $filter, owner: $owner) {
    content
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTodoSubscriptionVariables,
  APITypes.OnCreateTodoSubscription
>;
export const onDeletePatient = /* GraphQL */ `subscription OnDeletePatient(
  $filter: ModelSubscriptionPatientFilterInput
  $owner: String
) {
  onDeletePatient(filter: $filter, owner: $owner) {
    bloodPressure
    createdAt
    dateOfBirth
    height
    id
    name
    owner
    updatedAt
    weight
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePatientSubscriptionVariables,
  APITypes.OnDeletePatientSubscription
>;
export const onDeleteTodo = /* GraphQL */ `subscription OnDeleteTodo(
  $filter: ModelSubscriptionTodoFilterInput
  $owner: String
) {
  onDeleteTodo(filter: $filter, owner: $owner) {
    content
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTodoSubscriptionVariables,
  APITypes.OnDeleteTodoSubscription
>;
export const onUpdatePatient = /* GraphQL */ `subscription OnUpdatePatient(
  $filter: ModelSubscriptionPatientFilterInput
  $owner: String
) {
  onUpdatePatient(filter: $filter, owner: $owner) {
    bloodPressure
    createdAt
    dateOfBirth
    height
    id
    name
    owner
    updatedAt
    weight
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePatientSubscriptionVariables,
  APITypes.OnUpdatePatientSubscription
>;
export const onUpdateTodo = /* GraphQL */ `subscription OnUpdateTodo(
  $filter: ModelSubscriptionTodoFilterInput
  $owner: String
) {
  onUpdateTodo(filter: $filter, owner: $owner) {
    content
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTodoSubscriptionVariables,
  APITypes.OnUpdateTodoSubscription
>;
