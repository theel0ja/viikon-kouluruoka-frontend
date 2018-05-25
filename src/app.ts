// Import everything from express and assign it to the express variable
import compression from "compression";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import minify from "express-minify";
import sslRedirect from "heroku-ssl-redirect";
import lusca from "lusca";
import Raven from "raven";
import slugid from "slugid";
import twig from "twig";
import uglifyEs from "uglify-es";

dotenv.config();

// Import RestaurantController from controllers entry point
import { HomeController, RestaurantController } from "./controllers";
import viikonKouluruokaSites from "./viikonKouluruokaSites";

twig.extendFunction("getenv", (name: string) => {
  return process.env[name];
});

/**
 * Is server in production mode?
 */
const production = process.env.NODE_ENV === "production";

twig.extendFunction("isProd", () => {
  return production.toString();
});

/**
 * Enable Raven (Sentry) if production
 */
if (production) {
  Raven.config("https://fd3c65ae8bde436ca0b32183a6099b44@sentry.io/1209758").install();
}

/**
 * Create a new express application instance
 */
const app: express.Application = express();
app.use(sslRedirect(["production"], 301)); // Heroku

/**
 * Basic security headers
 */
app.use(lusca.nosniff());
app.use(lusca.xssProtection(true)); // TODO: Setup Report-URI for this (https://github.com/krakenjs/lusca/issues/124)

app.use(lusca.hsts({maxAge: 31536000, includeSubDomains: false, preload: false}));

/**
 * Static URLs, etc.
 */
let staticUrl: string = ""; // CDN url, such as ""

let cspReportUri: string;
let cssCdn: string = "";
let jsCdn: string = "";

if (production) {
  cspReportUri = process.env.REPORT_URI;

  staticUrl = "https://kouluruoka-cdn.theel0ja.info";

  cssCdn = "";
  jsCdn = staticUrl;
} else {
  cspReportUri = "/api/csp-report-dev";

  staticUrl = ""; // 'self'

  cssCdn = "";
  jsCdn = "'self'";
}

twig.extendFunction("getStaticUrl", () => {
  return staticUrl;
});

/**
 * getAssetVersion
 */

twig.extendFunction("getAssetVersion", () => {
  return (1).toString();
});

/**
 * useGAnalytics
 */

let analyticsImgSrc: string = "";
let analyticsScriptSrc: string = "";

let useGAnalytics: boolean = true;

if (!production) {
  useGAnalytics = false;
} else if (production) {
  const GOOGLE_ANALYTICS_UA = process.env.GOOGLE_ANALYTICS_UA;

  if (GOOGLE_ANALYTICS_UA === "UA-XXXXXXXXX-X") {
    useGAnalytics = false;
  } else if (!GOOGLE_ANALYTICS_UA) {
    useGAnalytics = false;
  }
}

if (useGAnalytics) {
  analyticsImgSrc = "https://www.google-analytics.com";
  analyticsScriptSrc = "https://www.googletagmanager.com https://www.google-analytics.com";
} else if (!useGAnalytics && production) {
  analyticsImgSrc = "https://analytics.theel0ja.info";
  analyticsScriptSrc = "https://analytics.theel0ja.info";
}

twig.extendFunction("useGAnalytics", () => {
  return useGAnalytics.toString();
});

/**
 * Content Security Policy
 */

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.nonce = slugid.v4();

  twig.extendFunction("getScriptNonce", () => {
    return res.locals.nonce;
  });

  // tslint:disable-next-line:max-line-length
  const jsLibs = "https://cdnjs.cloudflare.com/ajax/libs/jquery/ https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/ https://cdnjs.cloudflare.com/ajax/libs/raven.js/";

  lusca.csp({
    /* tslint:disable:object-literal-sort-keys */
    policy: {
      "default-src": "'none'",
      "manifest-src": "'self'",
      "img-src": analyticsImgSrc + " " + "'self' data:",
      "style-src": cssCdn + " " + "'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/",
      // script-src has 'unsafe-inline' just for backwards compability, it's ignored in browsers supporting nonces.
      // tslint:disable-next-line:max-line-length
      "script-src": `'unsafe-inline' ${analyticsScriptSrc} ${jsLibs} ${jsCdn} ${process.env.API_BACKEND}/menus/ https://cdn.theel0ja.info/libs/bsmenu-4/`,
      "report-uri": cspReportUri,
      "connect-src": "https://sentry.io",
      "block-all-mixed-content": "",
      "base-uri": "'none'",
    },
    scriptNonce: true,
    /* tslint:enable:object-literal-sort-keys */
  })(req, res, next);
});

/**
 * Other security headers
 */

app.use(lusca.xframe("DENY"));
app.use(lusca.referrerPolicy("no-referrer-when-downgrade"));

/**
 * Static assets
 */
app.use(compression());
app.use(minify({
  uglifyJsModule: uglifyEs,
}));
app.use(express.static("public"));

/**
 * Controllers and routes
 */

// Mount the RestaurantController at the /restaurants route
app.use("/", HomeController);
app.use("/restaurants/", RestaurantController);

app.get("/api/sites", (req: Request, res: Response, next: NextFunction) => {
  res.jsonp(viikonKouluruokaSites);
});

export default app;