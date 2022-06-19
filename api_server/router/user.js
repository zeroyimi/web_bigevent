const express = require('express')
const router = express.Router()
  
// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要验证的规则对象
const {reg_login_schema} = require('../schema/user')

// 注册新用户
// 在传入数据之后，先在expressJoi(reg_login_schema)中进行验证，
// 验证失败直接调用全局错误中间件，在app.js中设置错误中间件，验证成功则执行user_handler.regUser
router.post('/reguser',expressJoi(reg_login_schema),user_handler.regUser)

// 登录
router.post('/login',expressJoi(reg_login_schema),user_handler.login)

module.exports = router