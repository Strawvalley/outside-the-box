import express from "express";
import http from "http";
import path from "path";
import { logDebug } from "./managers/log_manager";

const app = express();

logDebug(`NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'development') {
  // Let Parcel handle requests
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler('client/index.html');
  app.use(bundler.middleware());
}
else {
  // Serve built client files
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
  });
}

// Create HTTP server with "app" as handler
export const server = http.createServer(app);
