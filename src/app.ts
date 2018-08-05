// Import everything from express and assign it to the express variable
import compression from "compression";
import dotenv from "dotenv";
import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import minify from "express-minify";
import minifyHTML from "express-minify-html";
import sslRedirect from "heroku-ssl-redirect";
import lusca from "lusca";
import Raven from "raven";
import slugid from "slugid";
import twig from "twig";
import uglifyEs from "uglify-es";

dotenv.config();

// Import controllers
import {
  HomeController,
  OEmbedController,
  RestaurantController,
} from "./controllers";
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
 * Root url
 */
const port: (string | number) = process.env.PORT || 3000; // Same as server.ts
// TODO: If ROOT_URL not found, use Host header?
const ROOT_URL = production ? process.env.ROOT_URL : `http://localhost:${port}`;

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

app.use(lusca.hsts({
  maxAge: 31536000,
  includeSubDomains: false,
  preload: false,
}));

/**
 * report-URI
 */

let cspReportUri: string;

if (production) {
  cspReportUri = process.env.REPORT_URI;
} else {
  cspReportUri = "/api/csp-report-dev";
}

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
  analyticsImgSrc = "https://www0.theel0ja.info/_a";
  analyticsScriptSrc = "https://www1.theel0ja.info";
}

twig.extendFunction("useGAnalytics", () => {
  return useGAnalytics.toString();
});

/**
 * Content Security Policy
 */

const serviceWorkerConnectSrc = "";

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.nonce = slugid.v4();

  twig.extendFunction("getScriptNonce", () => {
    return res.locals.nonce;
  });

  lusca.csp({
    /* tslint:disable:object-literal-sort-keys */
    policy: {
      "default-src": "'none'",
      "manifest-src": "'self'",
      "worker-src": "'self'",
      "img-src": analyticsImgSrc + " " + "'self' data:",

      "style-src": `'self' 'unsafe-inline'`,

      // script-src has 'unsafe-inline' just for backwards compability, it's ignored in browsers supporting nonces.
      // tslint:disable-next-line:max-line-length
      "script-src": `'self' 'unsafe-inline' ${analyticsScriptSrc}`,

      "report-uri": cspReportUri,
      "connect-src": `${serviceWorkerConnectSrc} https://sentry.io`,
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
app.use(lusca.referrerPolicy("no-referrer-when-downgrade"));

/**
 * Static assets
 */
app.use(compression());
app.use(minify({
  uglifyJsModule: uglifyEs,
}));

app.use(express.static("public"));
app.use("/assets/client/", express.static("client-dist"));
app.use("/assets/libs/raven-js/", express.static("node_modules/raven-js/dist/"));

// In production, minify HTML
if (production) {
  app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: false, // Do not change!
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  }));
}

/**
 * getCanonicalUrl
 * TODO: Real canonical URL
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  twig.extendFunction("getCanonicalUrl", () => {
    return ROOT_URL + req.originalUrl;
  });

  next();
});

/**
 * Controllers and routes
 */

// Mount the RestaurantController at the /restaurants route
app.use("/", HomeController);
app.use("/restaurants/", RestaurantController);

app.use("/api/oembed/", OEmbedController);

app.get("/api/sites", (req: Request, res: Response, next: NextFunction) =>
  res.jsonp(viikonKouluruokaSites));

/**
 * Error handlers
 */

// 404 - Not Found
app.use((req, res, next) => {
  res.status(404); // .header("Content-Security-Policy", "default-src 'self'"); // WIP

  res.render("errors/404.twig");
});

// 500 - Internal Server Error
app.use((err, req, res, next) => {
  if (production) {
    // If in production, send generic error message
    // TODO: Does it send the error to Sentry?

    res.status(500);

    res.render("errors/500.twig");
  } else {
    // If not in production, send to next() (default error handler) and console.error

    // TODO: tslint
    // console.error(err.stack);
    next(err);
  }
});

export default app;
