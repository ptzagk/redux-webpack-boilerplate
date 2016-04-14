'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../../config.server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { getCors } from '../cors'
var log = (0, _config.createServerLogger)('api');

var requireQ = function requireQ(path) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(path, 'utf8', function (err, data) {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

/**
 * API Module
 * Exposes apis for the application.
 * @module server/lib/api
 */

var configureApi = function configureApi() {
  var router = _express2.default.Router();
  //const cors = getCors()
  _config.client.STATIC = true;

  //CORS middleware
  var allowCrossDomain = function allowCrossDomain(req, res, next) {
    //if(req.method === 'OPTIONS') {
    //cors.handlePreflight(req, res)
    //} else {
    //cors.handle(req, res)
    next();
    //}
  };

  router.use(allowCrossDomain);
  router.get('/env', function (req, res) {
    return res.json({ NODE_ENV: process.env.NODE_ENV });
  });
  router.get('/client-config', function (req, res) {
    requireQ(router.locals.CLIENT_CONFIG_PATH).then(function (clientConfig) {
      if (req.query.pretty === '' || req.query.pretty) return res.send('<html><head><title>app client config</title></head><body><pre>' + JSON.stringify(clientConfig, null, 4) + '</pre></body></html>');
      res.json(clientConfig);
    }, function (err) {
      log.error(err, 'error occurred during client-config');
      res.json(_config.client);
    });
  });
  return router;
};

exports.default = configureApi;