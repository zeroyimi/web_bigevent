$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)

    var year = dt.getFullYear()
    var month = padZero(dt.getMonth() + 1)
    var day = padZero(dt.getDate())

    var hour = padZero(dt.getHours())
    var minute = padZero(dt.getMinutes())
    var secound = padZero(dt.getSeconds())

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + secound;
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1,  // 页码值，默认请求第一页数据
    pagesize: 2, // 每页显示几条数据，默认每页显示两条
    cate_id: '', // 文章分类的id
    status: '' // 文章的发布状态
  }
  initTable()
  initCate()
  // 获取文章列表数据的方法
  function initTable() {
    console.log('reset');
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败')
        }
        // 调用模板引擎渲染分类的可选项
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通知layui 重新渲染表单区域的ui结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定 submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()

    // 为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state

    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render() 来渲染分页的结构
    laypage.render({
      elem: 'pageBox',  // 分页容器的id
      count: total, //总数据条数
      limit: q.pagesize,  // 每页显示几条数据
      curr: q.pagenum, // 默认显示哪一页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发jump回调
      // 触发页码的回调方式有两种：
      // 1.点击页码的时候，会触发
      // 2.只要调用了laypage.render()方法，就会触发jump回调 
      jump: function (obj, first) {
        // 把最新的页码值，赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到q这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        // 根据最新的q 获取对应的数据列表，并渲染表格
        if (!first) {
          // 可以通过first的值，来判断是通过哪种方式，触发的jump回调，
          // 如果first的值为true，证明是方式2触发的
          initTable()
        }
      }
    })
  }

  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    console.log(len);
    // 获取到文章的id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功')
          // 当数据删除完成后，需要判断当前这一页是否还有剩余的数据
          // 如果没有剩余的数据了，则让页码值 -1 之后，
          // 再重新调用initTable() 方法
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum -= 1
          }
          initTable();
        }
      })
      layer.close(index);
    });
  })


  // 通过代理的形式，为编辑按钮点击事件处理函数
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    var id = $(this).attr('data-id')
    // 弹出一个修改文章分类的信息层
    indexEdit = layer.open({
      type: 1,
      area: ['1600px', '840px'],
      title: '修改文章',
      content: $('#dialog-edit').html()
    })

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    initCate()
    function initCate() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('初始化文章分类列表失败！')
          }
          // 调用模板引擎，渲染分类的下拉菜单
          var htmlStr = template('tpl-cate', res)
          $('[name=cate_id]').html(htmlStr)
          // 一定要记得调用form.render()方法
          form.render()
        }
      })
    }
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })

    // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
      $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
      // 获取到文件的列表数据
      let files = e.target.files
      // 判断用户有没有选择图片
      if (files.length === 0) {
        return
      }
      // 根据文件，创建对应 URL 地址
      var newImgURL = URL.createObjectURL(files[0])
      // 为裁剪区域重新设置图片
      $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'


    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
      art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('[name=form-edit]').on('submit', function (e) {
      e.preventDefault();
      console.log('123');
      console.log(this);
      // 基于 form 表单，快速创建一个 formData 对象
      var fd = new FormData($(this)[0])
      console.log(334);
      console.log(fd);
      // 将文章的发布状态，存放到 fd 中
      fd.append('state', art_state)
      // 将封面裁剪过后的图片， 输出为一个文件对象
      $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          // 将文件对象，存储到 fd 中
          fd.append('cover_img', blob)
          console.log(445);
          console.log(fd);
          // 发起 ajax 数据请求
          editArticle(fd)
        })
    })

    // 定义一个发布文章的方法
    function editArticle(fd) {
      $.ajax({
        method: 'POST',
        url: '/my/article/edit',
        data: fd,
        contentType: false,
        processData: false,
        success: function (res) {
          console.log(res);
          // if (res.status !== 0) {
          //   layer.msg('修改文章失败')
          // }
          // layer.msg('修改文章成功')
          layer.close(indexEdit)
          initTable()
        }
      })
    }


  })


})
