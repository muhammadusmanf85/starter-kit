/*
 * GULP TASKS CONFIGURATION
 * This file contains the variables used in gulp tasks.
 */

'use strict';

var path = require('path');
var gutil = require('gulp-util');
var fs = require('fs');
var bower = JSON.parse(fs.readFileSync('.bowerrc', 'utf8'));
var HttpsProxyAgent = require('https-proxy-agent');

/**
 *  The main paths of your project, handle these with care.
 */
exports.paths = {
  src: 'sources',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  main: 'main',
  bower: bower.directory
};

/**
 * API proxy configuration.
 * With the given example, HTTP request to like $http.get('/api/stuff') will be automatically proxified
 * to the specified server.
 * Multiple endpoints can be configured here.
 *
 * For more details and option, see https://github.com/chimurai/http-proxy-middleware/
 */
exports.backendProxy = [
  {
    context: '/api',
    options: {
      pathRewrite: {'^/api': ''},
      target: 'http://api.icndb.com',
      changeOrigin: true
    }
  }
];

/**
 *  Wiredep is the lib which inject bower dependencies in your project.
 *  Mainly used to inject script tags in the index.html but also used to inject css preprocessor
 *  deps and js files in karma.
 */
exports.wiredep = {
  exclude: [],
  directory: path.join(exports.paths.src, bower.directory),
  bowerJson: require('./' + path.join(exports.paths.src, 'bower.json'))
};

/**
 * Configures a corporate proxy agent for the API proxy.
 */
exports.corporateProxyAgent = function() {
  var agent = null;
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;

  if (proxyServer) {
    agent = new HttpsProxyAgent(proxyServer);
    gutil.log(gutil.colors.cyan('Using corporate proxy server: ' + proxyServer));
  }

  return agent;
};

/**
 * Common implementation for an error handler of a gulp plugin.
 */
exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
