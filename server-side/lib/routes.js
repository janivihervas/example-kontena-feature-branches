'use strict';

exports.index = (req, res) => {
  console.log('Index');
  
  res.render('index');
};

exports.api = (req, res) => {
  console.log('Api');

  res.json({
    status: 200,
    result: "It's alive!"
  });
};