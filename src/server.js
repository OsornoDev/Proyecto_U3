const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
  // no inline comments per guidelines; minimal log
  console.log(JSON.stringify({ msg: 'listening', port }));
});