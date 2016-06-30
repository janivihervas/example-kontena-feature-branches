(function () {
  'use strict';

  var timeElement = document.getElementById('time');
  timeElement.innerHTML = 'Current time is ' + (new Date()).toLocaleTimeString();

  var apiElement = document.getElementById('api');

  $.get('api/', function (result) {
    apiElement.innerHTML = 'Got result from api:' +
      '<div>Status code: ' + result.status + '</div>' +
      '<div>Message: ' + result.result + '</div>';
  })
    .fail(function (error) {
      apiElement.innerHTML = 'Could not load api result:' +
        '<div>Status code: ' + error.status + '</div>' +
        '<div>Message: ' + error.statusText + '</div>';
    });
})();
