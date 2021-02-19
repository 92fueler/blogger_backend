# Ugly Blogging Platform

## 目标

- 开发一个博客系统，具有博客的基本功能
- 只开发server端，不关心前端

## 项目需求

1. 首页，博客详情页，作者主页
2. 登录页
3. 作者个人的管理中心页面，以及新建页和修改页

## 技术方案

### 两个重点：

1. 数据如何存储
2. 如何与前端对接，即接口设计

### 数据如何存储

1. 博客内容存储

   | id   | title  | content  | createtime | author   |
   | ---- | ------ | -------- | ---------- | -------- |
   | 1    | title1 | content1 | 154        | jonhnson |
   | 2    | title2 | content2 |            | jack     |

2. 用户信息存储

   | id   | username | password | realname         |
   | ---- | -------- | -------- | ---------------- |
   | 1    | johnson  | 123456   | Johnson Williams |
   | 2    | jack     | 123456   | Jack Dan         |

### 接口设计

| desc              | API              | method | url param       | notes                          |
| ----------------- | ---------------- | ------ | --------------- | ------------------------------ |
| get blog list     | /api/blog/list   | GET    | author, keyword | if param is null, don't filter |
| get a blog        | /api/blog/detail | GET    | id              |                                |
| create a new blog | /api/blog/new    | POST   |                 |                                |
| update a blog     | /api/blog/update | POST   | id              |                                |
| delete a blog     | /api/blog/del    | POST   | id              |                                |
| login             | /api/user/login  | POST   |                 | username and password          |

### 关于登陆

1. 业界有统一的解决方案，一般不用再重新设计
2. 实现起来比较复杂



## 搭建开发环境

- 不使用任何框架

- 使用nodemon监测文件变化，自动重启node

  ```bash
  npm i nodemon --save
  ```

- 使用cross-env设置环境变量，兼容mac linux和windows

  ```bash
  npm i cross-env --save
  ```

  ```json
  // package.json
  
  "scripts": {
      "dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js"
  }
  ```

### 入口文件 `/bin/www.js`

```javascript
// create the server
const http = require('http')
const { serverHandle } = require('../app')

const PORT = 8000
const server = http.createServer(serverHandle)

server.listen(PORT, () => {
  console.log('app is runing at port ' + PORT)
})
```

### 创建serverHandle 

```javascript
// app.js 

const serverHandle = (req, res) => {
    res.setHeaders('Content-type', 'application/json')
    
    const resData = {
        name: 'joyce',
        site: 'example.com',
        env: process.env.NODE_ENV // 可以获取环境变量， NODE_ENV在package.json已设置为dev
    }
    
    res.end(JSON.stringify(resData))
}
```

## 开发接口

1. 初始化路由：根据之前技术方案的设计，做出路由
   - 两个文件：userRoute.js and blogRoute.js 来实现6个接口
   - 其中4个接口，url需要传递参数
2. 返回假数据：将路由和数据处理分离，以符合设计原则

```javascript
// blogRoute.js

const handleBlogRouter = (req, res) => {
    const method = req.method 
    const url = req.url
    const path = url.split('?')[0]
    
    if (method === 'GET' && path = '/api/blog/list') {
        
    }
    if (method === 'GET' && path = '/api/blog/detai') {
        
    }
    if (method === 'POST' && path = '/api/blog/new') {
        
    }
    if (method === 'POST' && path = '/api/blog/update') {
        
    }
    if (method === 'DELETE' && path = '/api/blog/delete') {
        
    }
}

module.exports = handleBlogRouter
```

```javascript
// userRoute.js

const handleUserRouter = (req, res) => {
    const method = req.method 
    const url = req.url
    const path = url.split('?')[0]
    
    if (method === 'GET' && path = '/api/user/login') {
        
    }
}

module.exports = handleUserRouter
```

```javascript
// app.js 

const serverHandle = (req, res) => {
    res.setHeaders('Content-type', 'application/json')
    
	// hanlde blog route
    const blogData = handleBlogRouter(req, res)
    if (blogData) {
        res.end(JSON.stringify(blogData))
    }
    return
    
    // hanlde user route
    const userData = handleUserRouter(req, res)
    if (userData) {
        res.end(JSON.stringify(userData))
    }
    return
    
    // handle 404 
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
}

module.exports = serverHandle
```

### create response data model 

```javascript
// ./model/resModel.js 

class BaseModel {
  constructor(data, message) {
      if (typeof data === 'string') {
          this.message = data
          data = null
          message = null
      }
      if (data) {
          this.data = data
      }
      if (message) {
          this.message = message
      }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
      super(data, message)
      this.errno = 0
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
      super(data, message)
      this.errno = -1
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}
```

### create controllers 

controller里面只关系数据，处理数据

```javascript
// ./controller/blogController.js 

const getList = (authoer, keyword) => {
    
}

const getDetail = (id) => {
    
}

const newBlog = (blogData = {}) => {
    
}

const updateBlog = (id, blogData = {}) => {
    
}

const delBlog = (id, authoer) => {
    
}

module.exports = {
    getList,
    getDetail,
    newBlog, 
    updateBlog, 
    delBlog
}
```

### refactor the router files 

路由文件只处理路由

```javascript
// blogRouter.js 

const {getList} = require('../controller/blogController.js')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleBlogRouter = (req, res) => {
    const method = req.method // GET or POST 
    
    if (method === 'GET' & req.path = '/api/blog/list') {
        const author = req.query.author || ''
        const keyword req.query.keyword || '' 
        const listData = getList(author, keyword)
        return new SuccessModel(listData)
    }
    
    ... 
}
```

### 处理data in the post body，简称postData

```javascript
// app.js 

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
    res.setHeaders('Content-type', 'application/json')
    
    // 获取path 
    const url = req.url
    req.path = url.split('?')[0]
    
    // 解析query 
    req.query = querystring.parse(url.split('?')[0])
    
    // 调用getPostData方法，得到post方法传给server的内容
    getPostData(req).then(postData => {
        req.body = postData
        
     // hanlde blog route
     const blogData = handleBlogRouter(req, res)
        if (blogData) {
            res.end(JSON.stringify(blogData))
        }
        return

     // hanlde user route
     const userData = handleUserRouter(req, res)
        if (userData) {
            res.end(JSON.stringify(userData))
        }
        return
    })
    
    
    // handle 404 
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
}

module.exports = serverHandle
```

### 新建和更新博客路由，这些都是POST方法，与GET方法不一样

```javascript
// ./controller/blogController.js 

const newBlog = (blogData = {}) => {
    
}
```





## 日志

