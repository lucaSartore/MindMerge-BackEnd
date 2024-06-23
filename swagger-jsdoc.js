const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mind Merge API',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Users',
        description: 'APIs for managing users',
      },
      {
        name: 'Account',
        description: 'APIs to manage account and login',
      },
      {
        name: 'Organizations',
        description: 'APIs for managing organizations',
      },
      {
        name: 'Tasks',
        description: 'APIs for managing tasks',
      },
      {
        name: 'Reports',
        description: 'APIs for managing reports',
      }
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            userId: {
              type: "integer",
              description: "The id of the user"
            },
            userName: {
              type: "string",
              description: "The name of the user"
            },
            organizations: {
              type: "array",
              items: {
                type: "integer"
              },
              description: "The ids of the organizations that the user is in"
            },
            userKind: {
              type: "integer",
              description: "The kind of the user (Custom, Google, Facebook)"
            },
            email: {
              type: "string",
              description: "The email of the user"
            }
          },
          required: [
            "userId",
            "userName",
            "organizations",
            "userKind",
            "email"
          ]
        },
        Task: {
          type: "object",
          properties: {
            taskId: {
              type: "integer",
              description: "The id of the task"
            },
            taskFatherId: {
              type: "integer",
              nullable: true,
              description: "The id of the father task"
            },
            lastUpdated: {
              type: "string",
              format: "date-time",
              description: "The date when the task was last updated"
            },
            taskName: {
              type: "string",
              description: "The name of the task"
            },
            taskDescription: {
              type: "string",
              description: "The description of the task"
            },
            taskStatus: {
              type: "integer",
              description: "The status of the task"
            },
            taskNotes: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TaskNote"
              },
              description: "The notes of the task"
            },
            taskAssignees: {
              type: "array",
              items: {
                type: "integer"
              },
              description: "A list containing the ids of the assignees for the current task"
            },
            taskManager: {
              type: "integer",
              description: "The id of the manager"
            },
            taskOrganizationId: {
              type: "integer",
              description: "The id of the organization"
            },
            taskReports: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TaskReportSchedule"
              },
              description: "The reports of the task"
            },
            notificationEnable: {
              type: "boolean",
              description: "Whether to send notification to the manager when the status of the task changes or not"
            },
            childTasks: {
              type: "array",
              items: {
                type: "integer"
              },
              description: "The ids of the child tasks"
            },
            recusivePermissionsValue: {
              type: "integer",
              description: "How far down the task tree the permissions of the task are inherited"
            }
          },
          required: [
            "taskId",
            "taskName",
            "taskDescription",
            "taskStatus",
            "taskAssignees",
            "taskManager",
            "taskOrganizationId",
            "taskNotes",
            "taskReports",
            "notificationEnable",
            "childTasks",
            "recusivePermissionsValue"
          ]
        },
        TaskReportSchedule: {
          type: "object",
          properties: {
            taskId: {
              type: "integer",
              description: "The id of the task"
            },
            reportScheduleId: {
              type: "integer",
              description: "The id of the report schedule"
            },
            reportType: {
              type: "integer",
              description: "The type of the report"
            },
            reportFrequency: {
              type: "integer",
              description: "The frequency of the report"
            },
            nextReportDate: {
              type: "string",
              format: "date-time",
              description: "The date when the report begins"
            },
            reportPrompt: {
              type: "string",
              description: "The prompt/question for the report"
            }
          },
          required: [
            "taskId",
            "reportScheduleId",
            "reportType",
            "reportFrequency",
            "nextReportDate",
            "reportPrompt"
          ]
        },
        TaskNote: {
          type: "object",
          properties: {
            noteId: {
              type: "integer",
              description: "The id of the note"
            },
            taskId: {
              type: "integer",
              description: "The id of the task the notes are for"
            },
            notes: {
              type: "string",
              description: "The note itself"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The date when the note was last edited"
            }
          },
          required: [
            "noteId",
            "taskId",
            "notes",
            "date"
          ]
        },
        Organization: {
          type: "object",
          properties: {
            organizationId: {
              type: "integer",
              description: "The id of the organization"
            },
            organizationName: {
              type: "string",
              description: "The name of the organization"
            },
            userIds: {
              type: "array",
              items: {
                type: "integer"
              },
              description: "The ids of the users in the organization"
            },
            licenseValid: {
              type: "boolean",
              description: "If the license of the organization is valid"
            },
            licenseExpirationDate: {
              type: "string",
              format: "date-time",
              description: "The date when the license expires"
            },
            ownerId: {
              type: "integer",
              description: "The id of the owner of the organization"
            }
          },
          required: [
            "organizationId",
            "organizationName",
            "userIds",
            "licenseValid",
            "licenseExpirationDate",
            "ownerId"
          ]
        },
        TaskTree: {
          type: "object",
          properties: {
            taskId: {
              type: "integer",
              description: "The id of the task"
            },
            childTasks: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TaskTree"
              },
              default: [],
              description: "The child tasks of the task"
            },
            taskName: {
              type: "string",
              description: "The name of the task"
            }
          },
          required: ["taskId", "childTasks", "taskName"]
        }
      }
    }
  },
  apis: [
    './app/services/account_manager/account_manager.js',
    './app/services/organization_manager/organization_editor.js',
    './app/services/report_manager/report_manager.js',
    './app/services/task_manager/task_router.js',
  ],
};

const openapiSpecification = swaggerJsdoc(options);
fs.writeFileSync('swagger.json', JSON.stringify(openapiSpecification, null, 2));