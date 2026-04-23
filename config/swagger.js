
import swaggerJSDoc from "swagger-jsdoc";

import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description: "API documentation for Finance App",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "development" ? "http://localhost:5000/auth" : "https://backend-finance-app-lw0y.onrender.com",
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
  apis: ["./routes/*.js"], // where your docs live
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;