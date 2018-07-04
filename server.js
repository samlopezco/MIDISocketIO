/*jshint esversion: 6 */
var express = require('express');
var app = express();
var socket = require('socket.io');
var io = require('socket.io').listen(server);
const port = process.env.port || 8080;
var server = app.listen(port);

app.use(express.static('public'));


io.sockets.on('connection', newConnection);
function newConnection(socket){
    console.log('Added Connection from: ' + socket.id);
    socket.on('midi', midiMsg);
    function midiMsg(data){
        socket.broadcast.emit('externalMidi', data);
    }
}

