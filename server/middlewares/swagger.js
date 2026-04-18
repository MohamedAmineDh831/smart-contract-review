const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require("../config/config");
const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Customer API Documentation',
            version: '1.0.0',
            description: 'API for customer management and blockchain integration',
        },
        servers: [
            {
                url: `${config.server.route}`,
                description: 'Development Server',
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = (app) => {
    app.use(`${config.server.route}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log(`Documentation available at:${config.server.route}/docs`);
};

