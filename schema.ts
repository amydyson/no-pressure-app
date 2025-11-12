import { Schema } from "@aws-amplify/datastore";

export const schema: Schema = {
    "models": {
        "Todo": {
            "name": "Todo",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "content": {
                    "name": "content",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Todos",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "provider": "apiKey",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Patient": {
            "name": "Patient",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "userId": {
                    "name": "userId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "firstName": {
                    "name": "firstName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "lastName": {
                    "name": "lastName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "avatar": {
                    "name": "avatar",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "gender": {
                    "name": "gender",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "isSmoker": {
                    "name": "isSmoker",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "height": {
                    "name": "height",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "weight": {
                    "name": "weight",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "exercisesDaily": {
                    "name": "exercisesDaily",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "language": {
                    "name": "language",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Patients",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "provider": "apiKey",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "AmplifyAIConversationParticipantRole": {
            "name": "AmplifyAIConversationParticipantRole",
            "values": [
                "user",
                "assistant"
            ]
        }
    },
    "nonModels": {
        "AmplifyAIDocumentBlockSource": {
            "name": "AmplifyAIDocumentBlockSource",
            "fields": {
                "bytes": {
                    "name": "bytes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIDocumentBlock": {
            "name": "AmplifyAIDocumentBlock",
            "fields": {
                "format": {
                    "name": "format",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "source": {
                    "name": "source",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIDocumentBlockSource"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "AmplifyAIImageBlock": {
            "name": "AmplifyAIImageBlock",
            "fields": {
                "format": {
                    "name": "format",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "source": {
                    "name": "source",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIImageBlockSource"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "AmplifyAIImageBlockSource": {
            "name": "AmplifyAIImageBlockSource",
            "fields": {
                "bytes": {
                    "name": "bytes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIToolUseBlock": {
            "name": "AmplifyAIToolUseBlock",
            "fields": {
                "toolUseId": {
                    "name": "toolUseId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "input": {
                    "name": "input",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "AmplifyAIToolResultContentBlock": {
            "name": "AmplifyAIToolResultContentBlock",
            "fields": {
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIDocumentBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "image": {
                    "name": "image",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIImageBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "json": {
                    "name": "json",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                },
                "text": {
                    "name": "text",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIToolResultBlock": {
            "name": "AmplifyAIToolResultBlock",
            "fields": {
                "content": {
                    "name": "content",
                    "isArray": true,
                    "type": {
                        "nonModel": "AmplifyAIToolResultContentBlock"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": false
                },
                "toolUseId": {
                    "name": "toolUseId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIContentBlockText": {
            "name": "AmplifyAIContentBlockText",
            "fields": {
                "text": {
                    "name": "text",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIContentBlockImage": {
            "name": "AmplifyAIContentBlockImage",
            "fields": {
                "image": {
                    "name": "image",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIImageBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIContentBlockDocument": {
            "name": "AmplifyAIContentBlockDocument",
            "fields": {
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIDocumentBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIContentBlockToolUse": {
            "name": "AmplifyAIContentBlockToolUse",
            "fields": {
                "toolUse": {
                    "name": "toolUse",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolUseBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIContentBlockToolResult": {
            "name": "AmplifyAIContentBlockToolResult",
            "fields": {
                "toolResult": {
                    "name": "toolResult",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolResultBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIContentBlock": {
            "name": "AmplifyAIContentBlock",
            "fields": {
                "text": {
                    "name": "text",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "document": {
                    "name": "document",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIDocumentBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "image": {
                    "name": "image",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIImageBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "toolResult": {
                    "name": "toolResult",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolResultBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "toolUse": {
                    "name": "toolUse",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolUseBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIToolConfiguration": {
            "name": "AmplifyAIToolConfiguration",
            "fields": {
                "tools": {
                    "name": "tools",
                    "isArray": true,
                    "type": {
                        "nonModel": "AmplifyAITool"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                }
            }
        },
        "AmplifyAITool": {
            "name": "AmplifyAITool",
            "fields": {
                "toolSpec": {
                    "name": "toolSpec",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolSpecification"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIToolSpecification": {
            "name": "AmplifyAIToolSpecification",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "inputSchema": {
                    "name": "inputSchema",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolInputSchema"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "AmplifyAIToolInputSchema": {
            "name": "AmplifyAIToolInputSchema",
            "fields": {
                "json": {
                    "name": "json",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIConversationMessageStreamPart": {
            "name": "AmplifyAIConversationMessageStreamPart",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "owner": {
                    "name": "owner",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "conversationId": {
                    "name": "conversationId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "associatedUserMessageId": {
                    "name": "associatedUserMessageId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "contentBlockIndex": {
                    "name": "contentBlockIndex",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "contentBlockText": {
                    "name": "contentBlockText",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "contentBlockDeltaIndex": {
                    "name": "contentBlockDeltaIndex",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "contentBlockToolUse": {
                    "name": "contentBlockToolUse",
                    "isArray": false,
                    "type": {
                        "nonModel": "AmplifyAIToolUseBlock"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "contentBlockDoneAtIndex": {
                    "name": "contentBlockDoneAtIndex",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "stopReason": {
                    "name": "stopReason",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "errors": {
                    "name": "errors",
                    "isArray": true,
                    "type": {
                        "nonModel": "AmplifyAIConversationTurnError"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "p": {
                    "name": "p",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AmplifyAIConversationTurnError": {
            "name": "AmplifyAIConversationTurnError",
            "fields": {
                "message": {
                    "name": "message",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "errorType": {
                    "name": "errorType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            }
        }
    },
    "codegenVersion": "3.4.4",
    "version": "2e8cf3019f5da1d62d9ba8d77df857b8"
};