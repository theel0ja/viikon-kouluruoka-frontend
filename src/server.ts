// Import everything from express and assign it to the express variable
import dotenv from "dotenv";
import express from "express";
import sslRedirect from "heroku-ssl-redirect";
import lusca from "lusca";
import twig from "twig";

dotenv.config();

// Import RestaurantController from controllers entry point
import { HomeController, RestaurantController } from "./controllers";

twig.extendFunction("getenv", (name: string) => {
  return process.env[name];
});

const production = process.env.NODE_ENV === "production";

// Create a new express application instance
const app: express.Application = express();
app.disable("x-powered-by");
app.use(sslRedirect(["production"], 301)); // Heroku
app.use(lusca.nosniff());
app.use(lusca.xssProtection(true)); // TODO: Setup Report-URI for this

app.use(lusca.hsts({maxAge: 31536000, includeSubDomains: false, preload: false}));

let cspReportUri: string;
if (production) {
  cspReportUri = process.env.REPORT_URI;
} else {
  cspReportUri = "/api/csp-report-dev";
}

app.use(lusca.csp({
  /* tslint:disable:object-literal-sort-keys */
  policy: {
      "default-src": "'none'",
      "img-src": "'self' data:",
      "style-src": "https://cdnjs.cloudflare.com",
      "script-src": "'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.theel0ja.info",
      "report-uri": cspReportUri,
      "block-all-mixed-content": "",
  },
  /* tslint:enable:object-literal-sort-keys */
}));

app.use(express.static("public"));

// Mount the RestaurantController at the /restaurants route
app.use("/", HomeController);
app.use("/restaurants/", RestaurantController);

// The port the express app will listen on
const port: (string | number) = process.env.PORT || 3000;

// Serve the application at the given port
app.listen(port, () => {
  // Success callback

  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});
