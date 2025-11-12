import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";
import { initSchema } from "@aws-amplify/datastore";

import { schema } from "./schema";

export enum AmplifyAiConversationParticipantRole {
  USER = "user",
  ASSISTANT = "assistant"
}

type EagerTodoModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly content?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTodoModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly content?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TodoModel = LazyLoading extends LazyLoadingDisabled ? EagerTodoModel : LazyTodoModel

export declare const TodoModel: (new (init: ModelInit<TodoModel>) => TodoModel) & {
  copyOf(source: TodoModel, mutator: (draft: MutableModel<TodoModel>) => MutableModel<TodoModel> | void): TodoModel;
}

type EagerPatientModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Patient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string | null;
  readonly avatar?: string | null;
  readonly gender?: string | null;
  readonly isSmoker?: boolean | null;
  readonly dateOfBirth?: string | null;
  readonly height?: number | null;
  readonly weight?: number | null;
  readonly exercisesDaily?: boolean | null;
  readonly language?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPatientModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Patient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string | null;
  readonly avatar?: string | null;
  readonly gender?: string | null;
  readonly isSmoker?: boolean | null;
  readonly dateOfBirth?: string | null;
  readonly height?: number | null;
  readonly weight?: number | null;
  readonly exercisesDaily?: boolean | null;
  readonly language?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PatientModel = LazyLoading extends LazyLoadingDisabled ? EagerPatientModel : LazyPatientModel

export declare const PatientModel: (new (init: ModelInit<PatientModel>) => PatientModel) & {
  copyOf(source: PatientModel, mutator: (draft: MutableModel<PatientModel>) => MutableModel<PatientModel> | void): PatientModel;
}

type EagerAmplifyAIDocumentBlockSourceModel = {
  readonly bytes?: string | null;
}

type LazyAmplifyAIDocumentBlockSourceModel = {
  readonly bytes?: string | null;
}

export declare type AmplifyAIDocumentBlockSourceModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIDocumentBlockSourceModel : LazyAmplifyAIDocumentBlockSourceModel

export declare const AmplifyAIDocumentBlockSourceModel: (new (init: ModelInit<AmplifyAIDocumentBlockSourceModel>) => AmplifyAIDocumentBlockSourceModel)

type EagerAmplifyAIDocumentBlockModel = {
  readonly format: string;
  readonly name: string;
  readonly source: AmplifyAIDocumentBlockSource;
}

type LazyAmplifyAIDocumentBlockModel = {
  readonly format: string;
  readonly name: string;
  readonly source: AmplifyAIDocumentBlockSource;
}

export declare type AmplifyAIDocumentBlockModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIDocumentBlockModel : LazyAmplifyAIDocumentBlockModel

export declare const AmplifyAIDocumentBlockModel: (new (init: ModelInit<AmplifyAIDocumentBlockModel>) => AmplifyAIDocumentBlockModel)

type EagerAmplifyAIImageBlockModel = {
  readonly format: string;
  readonly source: AmplifyAIImageBlockSource;
}

type LazyAmplifyAIImageBlockModel = {
  readonly format: string;
  readonly source: AmplifyAIImageBlockSource;
}

export declare type AmplifyAIImageBlockModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIImageBlockModel : LazyAmplifyAIImageBlockModel

export declare const AmplifyAIImageBlockModel: (new (init: ModelInit<AmplifyAIImageBlockModel>) => AmplifyAIImageBlockModel)

type EagerAmplifyAIImageBlockSourceModel = {
  readonly bytes?: string | null;
}

type LazyAmplifyAIImageBlockSourceModel = {
  readonly bytes?: string | null;
}

export declare type AmplifyAIImageBlockSourceModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIImageBlockSourceModel : LazyAmplifyAIImageBlockSourceModel

export declare const AmplifyAIImageBlockSourceModel: (new (init: ModelInit<AmplifyAIImageBlockSourceModel>) => AmplifyAIImageBlockSourceModel)

type EagerAmplifyAIToolUseBlockModel = {
  readonly toolUseId: string;
  readonly name: string;
  readonly input: string;
}

type LazyAmplifyAIToolUseBlockModel = {
  readonly toolUseId: string;
  readonly name: string;
  readonly input: string;
}

export declare type AmplifyAIToolUseBlockModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolUseBlockModel : LazyAmplifyAIToolUseBlockModel

export declare const AmplifyAIToolUseBlockModel: (new (init: ModelInit<AmplifyAIToolUseBlockModel>) => AmplifyAIToolUseBlockModel)

type EagerAmplifyAIToolResultContentBlockModel = {
  readonly document?: AmplifyAIDocumentBlock | null;
  readonly image?: AmplifyAIImageBlock | null;
  readonly json?: string | null;
  readonly text?: string | null;
}

type LazyAmplifyAIToolResultContentBlockModel = {
  readonly document?: AmplifyAIDocumentBlock | null;
  readonly image?: AmplifyAIImageBlock | null;
  readonly json?: string | null;
  readonly text?: string | null;
}

export declare type AmplifyAIToolResultContentBlockModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolResultContentBlockModel : LazyAmplifyAIToolResultContentBlockModel

export declare const AmplifyAIToolResultContentBlockModel: (new (init: ModelInit<AmplifyAIToolResultContentBlockModel>) => AmplifyAIToolResultContentBlockModel)

type EagerAmplifyAIToolResultBlockModel = {
  readonly content: AmplifyAIToolResultContentBlock[];
  readonly toolUseId: string;
  readonly status?: string | null;
}

type LazyAmplifyAIToolResultBlockModel = {
  readonly content: AmplifyAIToolResultContentBlock[];
  readonly toolUseId: string;
  readonly status?: string | null;
}

export declare type AmplifyAIToolResultBlockModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolResultBlockModel : LazyAmplifyAIToolResultBlockModel

export declare const AmplifyAIToolResultBlockModel: (new (init: ModelInit<AmplifyAIToolResultBlockModel>) => AmplifyAIToolResultBlockModel)

type EagerAmplifyAIContentBlockTextModel = {
  readonly text?: string | null;
}

type LazyAmplifyAIContentBlockTextModel = {
  readonly text?: string | null;
}

export declare type AmplifyAIContentBlockTextModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIContentBlockTextModel : LazyAmplifyAIContentBlockTextModel

export declare const AmplifyAIContentBlockTextModel: (new (init: ModelInit<AmplifyAIContentBlockTextModel>) => AmplifyAIContentBlockTextModel)

type EagerAmplifyAIContentBlockImageModel = {
  readonly image?: AmplifyAIImageBlock | null;
}

type LazyAmplifyAIContentBlockImageModel = {
  readonly image?: AmplifyAIImageBlock | null;
}

export declare type AmplifyAIContentBlockImageModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIContentBlockImageModel : LazyAmplifyAIContentBlockImageModel

export declare const AmplifyAIContentBlockImageModel: (new (init: ModelInit<AmplifyAIContentBlockImageModel>) => AmplifyAIContentBlockImageModel)

type EagerAmplifyAIContentBlockDocumentModel = {
  readonly document?: AmplifyAIDocumentBlock | null;
}

type LazyAmplifyAIContentBlockDocumentModel = {
  readonly document?: AmplifyAIDocumentBlock | null;
}

export declare type AmplifyAIContentBlockDocumentModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIContentBlockDocumentModel : LazyAmplifyAIContentBlockDocumentModel

export declare const AmplifyAIContentBlockDocumentModel: (new (init: ModelInit<AmplifyAIContentBlockDocumentModel>) => AmplifyAIContentBlockDocumentModel)

type EagerAmplifyAIContentBlockToolUseModel = {
  readonly toolUse?: AmplifyAIToolUseBlock | null;
}

type LazyAmplifyAIContentBlockToolUseModel = {
  readonly toolUse?: AmplifyAIToolUseBlock | null;
}

export declare type AmplifyAIContentBlockToolUseModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIContentBlockToolUseModel : LazyAmplifyAIContentBlockToolUseModel

export declare const AmplifyAIContentBlockToolUseModel: (new (init: ModelInit<AmplifyAIContentBlockToolUseModel>) => AmplifyAIContentBlockToolUseModel)

type EagerAmplifyAIContentBlockToolResultModel = {
  readonly toolResult?: AmplifyAIToolResultBlock | null;
}

type LazyAmplifyAIContentBlockToolResultModel = {
  readonly toolResult?: AmplifyAIToolResultBlock | null;
}

export declare type AmplifyAIContentBlockToolResultModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIContentBlockToolResultModel : LazyAmplifyAIContentBlockToolResultModel

export declare const AmplifyAIContentBlockToolResultModel: (new (init: ModelInit<AmplifyAIContentBlockToolResultModel>) => AmplifyAIContentBlockToolResultModel)

type EagerAmplifyAIContentBlockModel = {
  readonly text?: string | null;
  readonly document?: AmplifyAIDocumentBlock | null;
  readonly image?: AmplifyAIImageBlock | null;
  readonly toolResult?: AmplifyAIToolResultBlock | null;
  readonly toolUse?: AmplifyAIToolUseBlock | null;
}

type LazyAmplifyAIContentBlockModel = {
  readonly text?: string | null;
  readonly document?: AmplifyAIDocumentBlock | null;
  readonly image?: AmplifyAIImageBlock | null;
  readonly toolResult?: AmplifyAIToolResultBlock | null;
  readonly toolUse?: AmplifyAIToolUseBlock | null;
}

export declare type AmplifyAIContentBlockModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIContentBlockModel : LazyAmplifyAIContentBlockModel

export declare const AmplifyAIContentBlockModel: (new (init: ModelInit<AmplifyAIContentBlockModel>) => AmplifyAIContentBlockModel)

type EagerAmplifyAIToolConfigurationModel = {
  readonly tools?: (AmplifyAITool | null)[] | null;
}

type LazyAmplifyAIToolConfigurationModel = {
  readonly tools?: (AmplifyAITool | null)[] | null;
}

export declare type AmplifyAIToolConfigurationModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolConfigurationModel : LazyAmplifyAIToolConfigurationModel

export declare const AmplifyAIToolConfigurationModel: (new (init: ModelInit<AmplifyAIToolConfigurationModel>) => AmplifyAIToolConfigurationModel)

type EagerAmplifyAIToolModel = {
  readonly toolSpec?: AmplifyAIToolSpecification | null;
}

type LazyAmplifyAIToolModel = {
  readonly toolSpec?: AmplifyAIToolSpecification | null;
}

export declare type AmplifyAIToolModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolModel : LazyAmplifyAIToolModel

export declare const AmplifyAIToolModel: (new (init: ModelInit<AmplifyAIToolModel>) => AmplifyAIToolModel)

type EagerAmplifyAIToolSpecificationModel = {
  readonly name: string;
  readonly description?: string | null;
  readonly inputSchema: AmplifyAIToolInputSchema;
}

type LazyAmplifyAIToolSpecificationModel = {
  readonly name: string;
  readonly description?: string | null;
  readonly inputSchema: AmplifyAIToolInputSchema;
}

export declare type AmplifyAIToolSpecificationModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolSpecificationModel : LazyAmplifyAIToolSpecificationModel

export declare const AmplifyAIToolSpecificationModel: (new (init: ModelInit<AmplifyAIToolSpecificationModel>) => AmplifyAIToolSpecificationModel)

type EagerAmplifyAIToolInputSchemaModel = {
  readonly json?: string | null;
}

type LazyAmplifyAIToolInputSchemaModel = {
  readonly json?: string | null;
}

export declare type AmplifyAIToolInputSchemaModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIToolInputSchemaModel : LazyAmplifyAIToolInputSchemaModel

export declare const AmplifyAIToolInputSchemaModel: (new (init: ModelInit<AmplifyAIToolInputSchemaModel>) => AmplifyAIToolInputSchemaModel)

type EagerAmplifyAIConversationMessageStreamPartModel = {
  readonly id: string;
  readonly owner?: string | null;
  readonly conversationId: string;
  readonly associatedUserMessageId: string;
  readonly contentBlockIndex?: number | null;
  readonly contentBlockText?: string | null;
  readonly contentBlockDeltaIndex?: number | null;
  readonly contentBlockToolUse?: AmplifyAIToolUseBlock | null;
  readonly contentBlockDoneAtIndex?: number | null;
  readonly stopReason?: string | null;
  readonly errors?: (AmplifyAIConversationTurnError | null)[] | null;
  readonly p?: string | null;
}

type LazyAmplifyAIConversationMessageStreamPartModel = {
  readonly id: string;
  readonly owner?: string | null;
  readonly conversationId: string;
  readonly associatedUserMessageId: string;
  readonly contentBlockIndex?: number | null;
  readonly contentBlockText?: string | null;
  readonly contentBlockDeltaIndex?: number | null;
  readonly contentBlockToolUse?: AmplifyAIToolUseBlock | null;
  readonly contentBlockDoneAtIndex?: number | null;
  readonly stopReason?: string | null;
  readonly errors?: (AmplifyAIConversationTurnError | null)[] | null;
  readonly p?: string | null;
}

export declare type AmplifyAIConversationMessageStreamPartModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIConversationMessageStreamPartModel : LazyAmplifyAIConversationMessageStreamPartModel

export declare const AmplifyAIConversationMessageStreamPartModel: (new (init: ModelInit<AmplifyAIConversationMessageStreamPartModel>) => AmplifyAIConversationMessageStreamPartModel)

type EagerAmplifyAIConversationTurnErrorModel = {
  readonly message: string;
  readonly errorType: string;
}

type LazyAmplifyAIConversationTurnErrorModel = {
  readonly message: string;
  readonly errorType: string;
}

export declare type AmplifyAIConversationTurnErrorModel = LazyLoading extends LazyLoadingDisabled ? EagerAmplifyAIConversationTurnErrorModel : LazyAmplifyAIConversationTurnErrorModel

export declare const AmplifyAIConversationTurnErrorModel: (new (init: ModelInit<AmplifyAIConversationTurnErrorModel>) => AmplifyAIConversationTurnErrorModel)

const { Todo, Patient, AmplifyAIDocumentBlockSource, AmplifyAIDocumentBlock, AmplifyAIImageBlock, AmplifyAIImageBlockSource, AmplifyAIToolUseBlock, AmplifyAIToolResultContentBlock, AmplifyAIToolResultBlock, AmplifyAIContentBlockText, AmplifyAIContentBlockImage, AmplifyAIContentBlockDocument, AmplifyAIContentBlockToolUse, AmplifyAIContentBlockToolResult, AmplifyAIContentBlock, AmplifyAIToolConfiguration, AmplifyAITool, AmplifyAIToolSpecification, AmplifyAIToolInputSchema, AmplifyAIConversationMessageStreamPart, AmplifyAIConversationTurnError } = initSchema(schema) as {
  Todo: PersistentModelConstructor<TodoModel>;
  Patient: PersistentModelConstructor<PatientModel>;
  AmplifyAIDocumentBlockSource: PersistentModelConstructor<AmplifyAIDocumentBlockSourceModel>;
  AmplifyAIDocumentBlock: PersistentModelConstructor<AmplifyAIDocumentBlockModel>;
  AmplifyAIImageBlock: PersistentModelConstructor<AmplifyAIImageBlockModel>;
  AmplifyAIImageBlockSource: PersistentModelConstructor<AmplifyAIImageBlockSourceModel>;
  AmplifyAIToolUseBlock: PersistentModelConstructor<AmplifyAIToolUseBlockModel>;
  AmplifyAIToolResultContentBlock: PersistentModelConstructor<AmplifyAIToolResultContentBlockModel>;
  AmplifyAIToolResultBlock: PersistentModelConstructor<AmplifyAIToolResultBlockModel>;
  AmplifyAIContentBlockText: PersistentModelConstructor<AmplifyAIContentBlockTextModel>;
  AmplifyAIContentBlockImage: PersistentModelConstructor<AmplifyAIContentBlockImageModel>;
  AmplifyAIContentBlockDocument: PersistentModelConstructor<AmplifyAIContentBlockDocumentModel>;
  AmplifyAIContentBlockToolUse: PersistentModelConstructor<AmplifyAIContentBlockToolUseModel>;
  AmplifyAIContentBlockToolResult: PersistentModelConstructor<AmplifyAIContentBlockToolResultModel>;
  AmplifyAIContentBlock: PersistentModelConstructor<AmplifyAIContentBlockModel>;
  AmplifyAIToolConfiguration: PersistentModelConstructor<AmplifyAIToolConfigurationModel>;
  AmplifyAITool: PersistentModelConstructor<AmplifyAIToolModel>;
  AmplifyAIToolSpecification: PersistentModelConstructor<AmplifyAIToolSpecificationModel>;
  AmplifyAIToolInputSchema: PersistentModelConstructor<AmplifyAIToolInputSchemaModel>;
  AmplifyAIConversationMessageStreamPart: PersistentModelConstructor<AmplifyAIConversationMessageStreamPartModel>;
  AmplifyAIConversationTurnError: PersistentModelConstructor<AmplifyAIConversationTurnErrorModel>;
};

export {
  Todo,
  Patient
};