const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const { handleBlogRouter } = require('./src/router/blog')
const { handleUserRouter } = require('./src/router/user')

// 设置cookie过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000)) // 在24小时候后过期
  return d.toGMTString()
}

// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式为JSON
  res.setHeader('Content-type', 'application/json')

  // 获取 request path
  const url = req.url
  req.path = url.split('?')[0]

  // parse query
  req.query = querystring.parse(url.split('?')[1])

  // parse cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 解析 session using redis
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 session
    set(userId, {})
  }
  // 获取session
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化 redis 中的 session 值
      set(req.sessionId, {})
      // 设置 session
      req.session = {}
    } else {
      // 设置 session
      req.session = sessionData
    }
    // 处理 post data
    return getPostData(req)
  })
  .then(postData => {
    req.body = postData

    // handle blog routing
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          // set cookie
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // handle user routing
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          // set cookie
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // handle invalid routing
    res.writeHead(404, { "Content-type": "text/plain" })
    res.write("404 Not Found\n")
    res.end()
  })
}

module.exports = {
  serverHandle
}