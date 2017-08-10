'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var todomvc = require('todomvc');
var todomvcApi = require('todomvc-api');

var todos = require('./todosSpanner.js');

var app = module.exports.app = express();
var api = module.exports.api = express();
api.use(bodyParser.json());
app.use('/api', [todomvcApi.server, api])

// Declare the root route *before* inserting TodoMVC as middleware to prevent
// the TodoMVC app from overriding it.
app.get('/', function(req, res) {
  res.redirect('/examples/angularjs');
});
app.use(todomvc);

// Respond to the App Engine health check
app.get('/_ah/health', function(req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok');
});

// API Routes.
api.get('/', function(req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok');
});

api.get('/todos', function(req, res) {
  todos.getAll(_handleApiResponse(res));
});

api.get('/todos/:id', function(req, res) {
  var id = parseInt(req.params.id, 10);
  todos.get(id, _handleApiResponse(res));
});

api.post('/todos', function(req, res) {
  todos.insert(req.body, _handleApiResponse(res, 201));
});

api.put('/todos/:id', function(req, res) {
  var id = parseInt(req.params.id, 10);
  todos.update(id, req.body, _handleApiResponse(res));
});

api.delete('/todos', function(req, res) {
  todos.deleteCompleted(_handleApiResponse(res, 204));
});

api.delete('/todos/:id', function(req, res) {
  var id = parseInt(req.params.id, 10);
  todos.delete(id, _handleApiResponse(res, 204));
});

function _handleApiResponse(res, successStatus) {
  return function(err, payload) {
    if (err) {
      console.error(err);
      res.status(err.code).send(err.message);
      return;
    }
    if (successStatus) {
      res.status(successStatus);
    }
    res.json(payload);
  };
}


// Configure the sidebar to display relevant links for our hosted version of TodoMVC.
todomvc.learnJson = {};