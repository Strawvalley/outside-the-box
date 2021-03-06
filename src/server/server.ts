/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import http from "http";
import path from "path";
import { logDebug, logInfo } from "./managers/log_manager";

const app = express();

logDebug(`NODE_ENV: ${process.env.NODE_ENV} | PROD_ENV: ${process.env.PROD_ENV}`);

if (process.env.NODE_ENV === 'development') {
  // Let Parcel handle requests
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler('src/client/index.html');
  app.use(bundler.middleware());
} else {
  // Serve built client files
  if (process.env.PROD_ENV !== 'local') {
    const enforce = require('express-sslify');
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  // Use compression (gzip)
  const compression = require('compression');
  app.use(compression());

  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
  });
}

// Create HTTP server with "app" as handler
export const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => logInfo(`Listening on port: ${port}`));
