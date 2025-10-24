/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Patient = {
  __typename: "Patient",
  bloodPressure?: string | null,
  createdAt: string,
  dateOfBirth?: string | null,
  height?: number | null,
  id: string,
  name?: string | null,
  owner?: string | null,
  updatedAt: string,
  weight?: number | null,
};

export type Todo = {
  __typename: "Todo",
  content?: string | null,
  createdAt: string,
  id: string,
  owner?: string | null,
  updatedAt: string,
};

export type ModelPatientFilterInput = {
  and?: Array< ModelPatientFilterInput | null > | null,
  bloodPressure?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  height?: ModelFloatInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelPatientFilterInput | null,
  or?: Array< ModelPatientFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weight?: ModelFloatInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelPatientConnection = {
  __typename: "ModelPatientConnection",
  items:  Array<Patient | null >,
  nextToken?: string | null,
};

export type ModelTodoFilterInput = {
  and?: Array< ModelTodoFilterInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTodoFilterInput | null,
  or?: Array< ModelTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTodoConnection = {
  __typename: "ModelTodoConnection",
  items:  Array<Todo | null >,
  nextToken?: string | null,
};

export type ModelPatientConditionInput = {
  and?: Array< ModelPatientConditionInput | null > | null,
  bloodPressure?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  height?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelPatientConditionInput | null,
  or?: Array< ModelPatientConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weight?: ModelFloatInput | null,
};

export type CreatePatientInput = {
  bloodPressure?: string | null,
  dateOfBirth?: string | null,
  height?: number | null,
  id?: string | null,
  name?: string | null,
  weight?: number | null,
};

export type ModelTodoConditionInput = {
  and?: Array< ModelTodoConditionInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTodoConditionInput | null,
  or?: Array< ModelTodoConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTodoInput = {
  content?: string | null,
  id?: string | null,
};

export type DeletePatientInput = {
  id: string,
};

export type DeleteTodoInput = {
  id: string,
};

export type UpdatePatientInput = {
  bloodPressure?: string | null,
  dateOfBirth?: string | null,
  height?: number | null,
  id: string,
  name?: string | null,
  weight?: number | null,
};

export type UpdateTodoInput = {
  content?: string | null,
  id: string,
};

export type ModelSubscriptionPatientFilterInput = {
  and?: Array< ModelSubscriptionPatientFilterInput | null > | null,
  bloodPressure?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dateOfBirth?: ModelSubscriptionStringInput | null,
  height?: ModelSubscriptionFloatInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPatientFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  weight?: ModelSubscriptionFloatInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionTodoFilterInput = {
  and?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetPatientQueryVariables = {
  id: string,
};

export type GetPatientQuery = {
  getPatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type GetTodoQueryVariables = {
  id: string,
};

export type GetTodoQuery = {
  getTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type ListPatientsQueryVariables = {
  filter?: ModelPatientFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatientsQuery = {
  listPatients?:  {
    __typename: "ModelPatientConnection",
    items:  Array< {
      __typename: "Patient",
      bloodPressure?: string | null,
      createdAt: string,
      dateOfBirth?: string | null,
      height?: number | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
      weight?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTodosQueryVariables = {
  filter?: ModelTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodosQuery = {
  listTodos?:  {
    __typename: "ModelTodoConnection",
    items:  Array< {
      __typename: "Todo",
      content?: string | null,
      createdAt: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreatePatientMutationVariables = {
  condition?: ModelPatientConditionInput | null,
  input: CreatePatientInput,
};

export type CreatePatientMutation = {
  createPatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type CreateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: CreateTodoInput,
};

export type CreateTodoMutation = {
  createTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePatientMutationVariables = {
  condition?: ModelPatientConditionInput | null,
  input: DeletePatientInput,
};

export type DeletePatientMutation = {
  deletePatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type DeleteTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: DeleteTodoInput,
};

export type DeleteTodoMutation = {
  deleteTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePatientMutationVariables = {
  condition?: ModelPatientConditionInput | null,
  input: UpdatePatientInput,
};

export type UpdatePatientMutation = {
  updatePatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type UpdateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: UpdateTodoInput,
};

export type UpdateTodoMutation = {
  updateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePatientSubscriptionVariables = {
  filter?: ModelSubscriptionPatientFilterInput | null,
  owner?: string | null,
};

export type OnCreatePatientSubscription = {
  onCreatePatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type OnCreateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
  owner?: string | null,
};

export type OnCreateTodoSubscription = {
  onCreateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePatientSubscriptionVariables = {
  filter?: ModelSubscriptionPatientFilterInput | null,
  owner?: string | null,
};

export type OnDeletePatientSubscription = {
  onDeletePatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type OnDeleteTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTodoSubscription = {
  onDeleteTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatientSubscriptionVariables = {
  filter?: ModelSubscriptionPatientFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePatientSubscription = {
  onUpdatePatient?:  {
    __typename: "Patient",
    bloodPressure?: string | null,
    createdAt: string,
    dateOfBirth?: string | null,
    height?: number | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
    weight?: number | null,
  } | null,
};

export type OnUpdateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTodoSubscription = {
  onUpdateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};
