'use strict';

const express = require('express');
const Promise = require('bluebird');
var path = require('path');
var routes = require('./routes');
const virtualPath = process.env.KONTENA_LB_VIRTUAL_PATH;

let server;

module.exports = {
  start(port) {
    return new Promise((resolve) => {
      const app = express();

      app.set('views', path.join(__dirname, '../views'));
      app.set('view engine', 'jade');

      app.get('/', routes.index);

      if (virtualPath) {
        console.log('Virtual path to use: ' + virtualPath);
        
        const virtualPathApp = express();

        virtualPathApp.use(virtualPath, app);

        server = virtualPathApp.listen(port, resolve);
      } else {
        server = app.listen(port, resolve);
      }
    });
  },
  stop() {
    return new Promise(resolve => {
      server.close(resolve);
    })
  }
};
