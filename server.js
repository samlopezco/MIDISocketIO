/*jshint esversion: 6 */
var express = require('express');
var app = express();
const port = process.env.port || 8080;
var server = app.listen(port);

app.use(express.static('public'));
