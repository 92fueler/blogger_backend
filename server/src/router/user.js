const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method
  
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname
        // 同步到 redis
        set(req.sessionId, req.session)
        console.log('req.session is ', req.session)
        return Promise.resolve(new SuccessModel('login succeeded'))
      }
      return Promise.resolve(new ErrorModel('login failed'))
    })
  }
}

module.exports = {
  handleUserRouter
}