import express from "express";
import * as http from "http";

const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'development') {
  // Let Parcel handle requests
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler('client/index.html');
  app.use(bundler.middleware());
}
else {
  // Serve built client files
  app.use(express.static('dist'));
}

// Create HTTP server with "app" as handler
export const server = http.createServer(app);
