import app from "./app";

// Disable X-Powered-By
app.disable("x-powered-by");

// The port the express app will listen on
const port: (string | number) = process.env.PORT || 3000;

// Serve the application at the given port
const server = app.listen(port, () => {
  // Success callback

  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}/`);
});

export default server;
