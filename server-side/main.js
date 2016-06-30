'use strict';

const server = require('./lib/server');

const port = process.env.PORT | 3000;

function stop(exitCode) {
  exitCode = exitCode === undefined ? 0 : exitCode;
  console.log('Stopping the server...');
  server.stop()
    .then(() => {
      console.log('Server stopped successfully');
      process.exit(exitCode);
    })
    .catch(err => {
      console.error('Could not stop the server: ' + err);
      process.exit(1);
    });
}

server.start(port)
  .then(() => console.log(`Server started at ${port}`))
  .catch(error => {
    console.error(`Couldn't start the server: ${error}`);
    process.exit(1);
  });


process.on('uncaughtException', (error) => {
  console.error('Uncaught exception: ' + error);
  stop(1);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');
  stop();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  stop();
});
