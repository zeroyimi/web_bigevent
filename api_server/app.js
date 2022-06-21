// 导入express
const express = require('express')
// 创建express服务器的实例对象
const app = express()

// 捕获验证失败的错误，并把验证失败的结果给客户端
const joi = require('joi')

// 在app.js中导入并配置cors中间件:
const cors = require('cors')
// 将cors注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件,注意这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单的表单数据中间件:
app.use(express.urlencoded({extended:false}))

// 一定要在路由之前，封装res.cc函数
app.use((req,res,next)=>{
  // status默认值为1表示失败的情况
  // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function(err,status=1){
    res.send({
      status,
      message:err instanceof Error ? err.message:err,
    })
  }
  next()
})

// 一定要在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)
// 导入并使用信息的路由模块
const userInfoRouter = require('./router/userInfo')
app.use('/my',userInfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/artcate',artCateRouter)
// 导入并使用文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article',articleRouter)

// 定义错误级别的中间件
app.use((err,req,res,next)=>{
  // 验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误 解析expressJWT({secret:config.jwtSecretKey})时出现的错误
  if(err.name === 'UnauthorizeError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})



// 调用api.listen方法，指定端口并启动服务器
app.listen(3007,function(){
  console.log('api server running at http://127.0.0.1:3007');
})

