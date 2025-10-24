/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createPatient = /* GraphQL */ `mutation CreatePatient(
  $condition: ModelPatientConditionInput
  $input: CreatePatientInput!
) {
  createPatient(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatientMutationVariables,
  APITypes.CreatePatientMutation
>;
export const createTodo = /* GraphQL */ `mutation CreateTodo(
  $condition: ModelTodoConditionInput
  $input: CreateTodoInput!
) {
  createTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTodoMutationVariables,
  APITypes.CreateTodoMutation
>;
export const deletePatient = /* GraphQL */ `mutation DeletePatient(
  $condition: ModelPatientConditionInput
  $input: DeletePatientInput!
) {
  deletePatient(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatientMutationVariables,
  APITypes.DeletePatientMutation
>;
export const deleteTodo = /* GraphQL */ `mutation DeleteTodo(
  $condition: ModelTodoConditionInput
  $input: DeleteTodoInput!
) {
  deleteTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTodoMutationVariables,
  APITypes.DeleteTodoMutation
>;
export const updatePatient = /* GraphQL */ `mutation UpdatePatient(
  $condition: ModelPatientConditionInput
  $input: UpdatePatientInput!
) {
  updatePatient(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatientMutationVariables,
  APITypes.UpdatePatientMutation
>;
export const updateTodo = /* GraphQL */ `mutation UpdateTodo(
  $condition: ModelTodoConditionInput
  $input: UpdateTodoInput!
) {
  updateTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTodoMutationVariables,
  APITypes.UpdateTodoMutation
>;
