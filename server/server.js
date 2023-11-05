// create the server
const http = require('http')
const { serverHandle } = require('./app')

const PORT = 8000
const server = http.createServer(serverHandle)

server.listen(PORT, () => {
  console.log('app is runing at port ' + PORT)
})
