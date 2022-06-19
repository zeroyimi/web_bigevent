// 1. 导入定义验证规则的模块
const joi = require('joi')

// 2. 定义name和alias的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// Id的校验规则
const Id = joi.number().integer().min(1).required()
// 3. 向外共享验证规则对象
exports.add_cate_schema = {
  body:{
    name,
    alias
  }
}

// 验证规则对象- 删除分类
exports.delete_cate_schema = {
  params:{
    Id,
  },
}

// 验证规则对象-根据Id获取文章分类
exports.get_cate_schema = {
  params:{
    Id
  }
}

//验证规则-更新分类
exports.update_cate_schema = {
  body:{
    Id,
    name,
    alias,
  }
}
