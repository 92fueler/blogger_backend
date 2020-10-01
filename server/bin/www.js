// create the server
const http = require('http')
const { serverHandle } = require('../app')

const PORT = 2000
const server = http.createServer(serverHandle)

server.listen(2000)

console.log('app is runing at port 2000')