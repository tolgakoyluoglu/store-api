import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    description: `<div><h4>E-commerce API</h4></div>`,
    title: 'Shop 1.0',
    version: '1.0.0',
  },
  basePath: '/api',
  tags: [
    {
      name: 'Customers',
      description: 'Customers endpoint',
    },
    {
      name: 'Categories',
      description: 'Categories endpoint',
    },
    {
      name: 'Products',
      description: 'Products endpoint',
    },
  ],
  components: {
    securitySchemes: {
      'x-api-key': {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
    },
    security: {
      'x-api-key': [],
    },
  },
}
const options = {
  swaggerDefinition,
  apis: ['**/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export = swaggerSpec
