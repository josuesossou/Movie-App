import express from 'express';
import socketIO from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

module.exports = {
    server,
    app,
    io, 
    http
};
