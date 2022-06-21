// 这是路由处理函数模块

// 导入数据库操作模块
const res = require('express/lib/response')
const db = require('../db/index')
// console.log(db)
// 获取文章分类列表的处理函数
exports.getArticleCates = (req,res)=>{
  // 定义查重分类列表数据的SQL语句
  const sql = `select * from ev_article_cate where is_delete=0 order by Id asc`
// 调用db.query()方法执行SQL语句
  db.query(sql,(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:0,
      message:'获取文章分类数据成功！',
      data:results,
    })
  })  
}

// 新增文章分类的处理函数
exports.addArticleCates = (req,res)=>{
  // 1. 定义查重的SQL语句
  const sql = `select * from ev_article_cate where name=? or alias=?`
  // 2. 执行查重的SQL语句
  db.query(sql,[req.body.name,req.body.alias],(err,results)=>{
    // 3. 判断是否执行SQL语句失败
    if(err) return res.cc(err)

    // 4.1 判断数据的length
    if(results.length===2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
    // 4.2 length等于1的三种情况
    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 分别判断 分类名称 和 分类别名 是否被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
    // TODO: 分类名称和分类别名都可用，执行添加的动作
    // 定义插入文章分类的SQL语句
    const sql =  `insert into ev_article_cate set ?`
    // 执行插入文章分类的SQL语句
    db.query(sql,req.body,(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1) return res.cc('新增文章分类失败！')
      res.cc('插入文章分类成功！',0)
    })
    
  })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req,res)=>{
  // 定义标记删除的SQL语句
  const sql = `update ev_article_cate set is_delete=1 where Id=?`
  // 调用db.query()执行SQL语句
   db.query(sql,req.params.Id,(err,results)=>{
     if(err) return res.cc(err)
     if(results.affectedRows!==1) return res.cc('删除文章分类失败！')
     res.cc('删除文分类成功！',0)
   })
}

// 根据Id获取文章分类的处理函数
exports.getArtCateById = (req,res) =>{
  // 定义根据Id获取文章分类数据的SQL语句
  var sql = `select * from ev_article_cate where id=?`
  // 调用db.query()执行SQL语句
  db.query(sql,req.params.Id,(err,results)=>{
    if(err) return res.cc(err)
    if(results.length!==1) return res.cc('获取文章分类数据失败！')
    res.send({
      status:0,
      message:'获取文章分类数据成功！',
      data:results[0],
    })
  })
}

// 根据Id更新文章分类的处理函数
exports.updateCateById = (req,res)=>{
  // 定义查重分类名称与分类名称是否被占用SQL语句
  const sql =  `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
  // 执行查重操作
  db.query(sql,[req.body.Id,req.body.name,req.body.alias],(err,results)=>{
    // 执行SQL语句失败
    if(err) return res.cc(err)
    // 判断分类名称和分类别名是否被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 分类名称被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    // 分类别名被占用
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
    // 更新文章的SQL语句
    const sql = `update ev_article_cate set ? where Id=?`
    // 调用db.query执行SQL语句
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)    
      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')    
      // 更新文章分类成功
      res.cc('更新文章分类成功！', 0)
    })
  })
}
