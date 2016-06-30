'use strict';

const express = require('express');
const Promise = require('bluebird');

let server;

module.exports = {
  start(port) {
    return new Promise((resolve) => {
      const app = express();
      app.get('/api/', (req, res) => {
        console.log('Request!');

        res.json({
          status: 200,
          result: "It's alive!"
        });
      });

      app.get('*', (req, res) => {
        console.error('404');

        res.status(404).json({
          status: 404,
          result: 'Not found'
        });
      });

      server = app.listen(port, resolve);
    });
  },
  stop() {
    return new Promise(resolve => {
      server.close(resolve);
    });
  }
};
