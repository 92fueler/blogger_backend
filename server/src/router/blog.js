const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
      return Promise.resolve(
          new ErrorModel('尚未登录')
      )
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id 

  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || ''
    let keyword = req.query.keyword || ''

    if (req.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
          // 未登录
          return loginCheckResult
      }
      // 强制查询自己的博客
      author = req.session.username
    }
    
    // getList returns a promise
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  if (method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(blogData => {
      return new SuccessModel(blogData, 'blog detail is fetched')
    })
  }

  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(blogData => {
      return new SuccessModel(blogData, 'new blog is created')
    })
  }

  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const result = updateBlog(id, req.body)
    return result.then(blogUpdated => {
      if (blogUpdated) {
        return new SuccessModel('blog is updated')
      } else {
        return new ErrorModel('blog update failed')
      }
    })
  }

  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(blogDelete => {
      if (blogDelete) {
        return new SuccessModel('blog is deleted')
      } else {
        return new ErrorModel('blog deletion failed')
      }
    })
  }
}

module.exports = {
  handleBlogRouter
}