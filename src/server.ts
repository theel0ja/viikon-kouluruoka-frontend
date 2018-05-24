// Import everything from express and assign it to the express variable
import compression from "compression";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import minify from "express-minify";
import sslRedirect from "heroku-ssl-redirect";
import lusca from "lusca";
import Raven from "raven";
import twig from "twig";

dotenv.config();

// Import RestaurantController from controllers entry point
import { HomeController, RestaurantController } from "./controllers";
import viikonKouluruokaSites from "./viikonKouluruokaSites";

twig.extendFunction("getenv", (name: string) => {
  return process.env[name];
});

const production = process.env.NODE_ENV === "production";

if (production) {
  Raven.config("https://fd3c65ae8bde436ca0b32183a6099b44@sentry.io/1209758").install();
}

twig.extendFunction("isProd", () => {
  return production.toString();
});

// Create a new express application instance
const app: express.Application = express();
app.disable("x-powered-by");
app.use(sslRedirect(["production"], 301)); // Heroku
app.use(lusca.nosniff());
app.use(lusca.xssProtection(true)); // TODO: Setup Report-URI for this (https://github.com/krakenjs/lusca/issues/124)

app.use(lusca.hsts({maxAge: 31536000, includeSubDomains: false, preload: false}));

let cspReportUri: string;

let cssCdn: string = "";
let jsCdn: string = "";

if (production) {
  cspReportUri = process.env.REPORT_URI;
  
  // cssCdn = "";
  jsCdn = "https://kouluruoka-cdn.theel0ja.info";
} else {
  cspReportUri = "/api/csp-report-dev";
  
  // cssCdn = "";
  jsCdn = "'self'";
}

/* TODO: Set these only if site uses google analytics instead of Matomo */
const gAnalyticsImgSrc = "https://www.google-analytics.com";
const gAnalyticsScriptSrc = "https://www.googletagmanager.com https://www.google-analytics.com";

app.use(lusca.csp({
  /* tslint:disable:object-literal-sort-keys */
  policy: {
    "default-src": "'none'",
    "manifest-src": "'self'",
    "img-src": gAnalyticsImgSrc + " " + "https://analytics.theel0ja.info 'self' data:",
    "style-src": cssCdn + " " + "'unsafe-inline' https://cdnjs.cloudflare.com",
    // tslint:disable-next-line:max-line-length
    "script-src": gAnalyticsScriptSrc + " " + jsCdn + " " + "https://analytics.theel0ja.info " + process.env.API_BACKEND + "/menus/ 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.theel0ja.info",
    "report-uri": cspReportUri,
    "connect-src": "https://sentry.io",
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

app.get("/api/sites", (req: Request, res: Response, next: NextFunction) => {
  res.jsonp(viikonKouluruokaSites);
});

// The port the express app will listen on
const port: (string | number) = process.env.PORT || 3000;

// Serve the application at the given port
app.listen(port, () => {
  // Success callback

  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});
