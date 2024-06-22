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