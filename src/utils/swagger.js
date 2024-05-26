import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Property Matching System API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);

export const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
