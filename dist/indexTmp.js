const app = require('.');
// const socket = require('./socketio')
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || '3000';
server.listen(port, () => {
    console.log('start on port', port);
});
// socket.init(server)
module.exports = app;
