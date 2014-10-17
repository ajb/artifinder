var express = require('express')
var app = express()
var _s = require('underscore.string')
var request = require('request')

app.get('*', function (req, res) {
  var fullUrl = req.url
  var splitUrl = fullUrl.replace(/\?.*$/, '').split('/');
  var repo = splitUrl[2] + '_' + splitUrl[3]
  var token = process.env[_s.underscored(repo).toUpperCase() + '_TOKEN'];
  var pw = process.env[_s.underscored(repo).toUpperCase() + '_PW'];

  if (pw && (req.param('pw') != pw)) {
    return res.send('wrong pw', 404);
  }

  request({
    url: 'https://circleci.com/api/v1/project/' + splitUrl[2] + '/' + splitUrl[3] + '?circle-token=' + token,
    headers: { 'Accept': 'application/json' }
  }, function (error, response, body) {
    if (response.statusCode !== 200) {
      return res.send('error finding buildNum.', 404);
    }

    var parsedBody = JSON.parse(body);

    if (parsedBody[0].status === 'success') {
      var buildNum = parsedBody[0].build_num;
    } else {
      var buildNum = parsedBody[0].previous_successful_build.build_num;
    }

    splitUrl[4] = buildNum;
    request('https://circle-artifacts.com/' + splitUrl.join('/') + '?circle-token=' + token).pipe(res);

    res.oldWriteHead = res.writeHead;
    res.writeHead = function(statusCode, reasonPhrase, headers){
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.oldWriteHead(statusCode, reasonPhrase, headers);
    }
  });
});

app.listen(process.env.PORT || 3000);
