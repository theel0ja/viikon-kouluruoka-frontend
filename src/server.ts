// Import everything from express and assign it to the express variable
import dotenv from "dotenv";
import express from "express";
import twig from "twig";

dotenv.config();

// Import RestaurantController from controllers entry point
import { /* CategoryController,  */RestaurantController } from "./controllers";

// Create a new express application instance
const app: express.Application = express();
app.disable("x-powered-by");

// The port the express app will listen on
const port: (string | number) = process.env.PORT || 3000;

// Mount the RestaurantController at the /restaurants route
app.use("/restaurants", RestaurantController);
// app.use("/categories", CategoryController);

// Serve the application at the given port
app.listen(port, () => {
  // Success callback

  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});
