'use strict';

const exec = require('child_process').exec;
const regex = process.env.REGEX;
const title = process.env.TITLE || 'Kontena services';

exports.index = (req, res) => {
  console.log('Fetching Kontena service list');

  exec('kontena service list', (error, stdOut, stdErr) => {
    if (error) {
      const errorMsg = 'Could not retrieve services';
      console.error(errorMsg);

      res.status(500).json({
        status: 500,
        result: errorMsg,
        error: stdErr
      });
      return;
    }
    console.log('----------------------------------');
    console.log('std out:\n' + stdOut);
    console.log('----------------------------------');

    const result = stdOut.match(new RegExp(regex, 'g')) || [];
    console.log('First result: ' + JSON.stringify(result, null, 4));

    let services = result.map(s => s.match(new RegExp(regex))[1]);
    console.log('Final services: ' + JSON.stringify(services, null, 4));

    res.render('index', {title: title, services: services});
  });
};
