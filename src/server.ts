// Import everything from express and assign it to the express variable
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import minify from "express-minify";
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
    "manifest-src": "'self'",
    "img-src": "'self' data:",
    "style-src": "https://cdnjs.cloudflare.com",
    // tslint:disable-next-line:max-line-length
    "script-src": "'self' " + process.env.API_BACKEND + "/menus/ 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.theel0ja.info https://www.googletagmanager.com/",
    "report-uri": cspReportUri,
    "block-all-mixed-content": "",
  },
  /* tslint:enable:object-literal-sort-keys */
}));

app.use(lusca.xframe("DENY"));
app.use(lusca.referrerPolicy("no-referrer-when-downgrade"));

app.use(compression());
app.use(minify());
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
