import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TypeBout API',
      version: '1.0.0',
      description:
        'REST API for typeracing game TypeBout, implemented in Express and TS.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.EXPRESS_PORT}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routers/*.ts']
};

const openapiSpecification = swaggerJsdoc(options);

export const addSwagger = (app: Application) => {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
};
