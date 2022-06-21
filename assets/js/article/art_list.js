$(function(){
  var layer = layui.layer
  var form = layui.form
  // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
  var q = {
    pagenum:1,  // 页码值，默认请求第一页的数据
    pagesize:2, // 默认每页显示2条
    cate_id:'', // 文章分类的Id
    state:''  // 文章的发布信息
  }

  initTable()
  // 获取文章列表数据的方法
  function initTable(){
    $.ajax({
      method:'GET',
      url:'/my/artcate/list',
      data:1,
      success:function(res){
        if(res.status!==0){
          return layer.msg('请求数据失败！')
        }
        // 使用模板引擎来渲染页面数据
        var htmlStr = template('tpl-table',res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        rendPage(res.total)
      }
    })
  }

  // 暂时缺少数据，需要去服务器搭建数据
  // 初始化文章分类的方法
  $.ajax({
    methods:'GET',
    url:'/my/artcate/cates',
    success:function(res){
      if(res.status !== 0){
        return layer.msg('获取分类数据失败')
      }
      // 调用模板引擎渲染分类的可选项
      var htmlStr = template('tap-cate',res)
      $('[name=cate_id]').html(htmlStr)
      // 通知layui重新渲染表单区域的解构
      form.render()
    }
  })

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit',function(e){
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数数据对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function rendPage(total){
      // console.log(total)
      layui.use('laypage', function(){
        //调用laypage.render对象来初始化分页的结构  
        //执行一个laypage实例
        laypage.render({
          elem: 'pageBox', // 注意，这里的 pageox 是 ID，不用加 # 号
          count: total, //数据总数，从服务端得到 
          curr:q.pagenum,   // 默认显示第几页
          limit:q.pagesize,  // 一页显示几条数据
          layout:['count','limit','prev','page','next','skip'],  // 顺序是有用的
          limits:[2,3,5,10],
          // 分页发生切换的时候，触发jump回调
          // 触发jump回调的方式有两种
          // 1. 点击页码时，会触发jump回调
          // 2. 只要调用了laypage.render()方法，就会触发jump回调 第二条方式才会造成死循环
          // 第一种方式调用Jump first返回false 第二种方式触发默认打印true
          jump: function(obj, first){
            // 可以通过first的值，来判断是通过那种方式，触发的jump回调
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            //首次不执行
            if(!first){
              // 把最新的页码值，赋值到q这个查询对象中
              q.pagenum = obj.curr
              // 把最新的条目数，赋值到q这个查询对象的pagesize属性中
              q.pagesize = obj.limit
              // 根据最新的q获取对应的数据列表，并渲染表格
              // initTable() // 直接调用，会造成死循环，jump回调会一直会被触发
              // 如果通过laypage.render触发的Jump就不调用initTable
              if(!first){
                initTable()
              }
            }
          }
        });
      });
  }

  // 通过代理的形式，未删除按钮绑定点击事件处理函数
  $('tbody').on('click','.btn-delete',function(){
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
      // 获取到文章的id
      var id = $(this).attr('data-id')
      $.ajax({
        method:'GET',
        url:'/my/artcate/delete/'+id,
        success:function(res){
          if(res.status!==0) return layer.msg('删除文章失败！')
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前页中，是否还有剩余的数据
          // 如果没有剩余的数据了，则让代码值-1之后，在重新调用initTable方法
          if(len===1){
            // 如果len的值等于1，证明删除完毕之后，页面上没有任何数据了
            // 页码值最小必须是1
            q.pagenum===1?1:q.pagenum-1
          }
          initTable()
        }
      })

      layer.close(index)

    })
  })
})