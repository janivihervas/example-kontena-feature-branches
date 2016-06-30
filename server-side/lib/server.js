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

        app.use(express.static(path.join(__dirname, '../public')));

        app.get('/', routes.index);
        app.get('/api/', routes.api);
        app.get('*', (req, res) => {
          console.error('404');

          res.status(404).json({
            status: 404,
            result: 'Not found'
          });
        });

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

