$(function(){
  // 调用 getUserInfo 用户的基本信息
  getUserInfo()

  var layer = layui.layer

  $('#btnLogout').on('click',function(){
    // 提示用户是否退出
    layer.confirm('确认退出登录?', {icon: 3, title:'提示'}, 
    function(index){
      // console.log('ok')  
      // 1. 清除本地存储中的token 
      localStorage.removeItem('token')
      // 2. 重新跳转登录页
      location.href='./login.html'
      // 关闭confirm询问框
      layer.close(index);
    });
  })
})

// 获取用户的基本信息
function getUserInfo(){
  $.ajax({
    method:'GET',
    url:'/my/userinfo',
    // headers 就是请求头配置
    // headers: {
    //   // 获取存储到本地存储中的token
    //   Authorization: localStorage.getItem("token") || ''
    // },
    success: function(res){
      // console.log(res)
      if(res.status !== 0){
        return layui.layer.msg('获取用户信息失败！')
      }
      // 调用 renderAvatar() 渲染用户头像
      renderAvatar(res.data)
    },
    // 不论成功还是失败都会调用complite回调
    // complete: function(res){
    //   // 在conplete回调函数中，可以使用res.responseJSON拿到服务器响应的数据
    //   if(res.responseJSON.status===1&&res.responseJSON.message==="身份验证失败")
    //   // 1. 强制清空token
    //   localStorage.removeItem('token')
    //   // 2. 强制跳转到登录界面
    //   location.href="./login.html"
    // }
  })
}

// 渲染用户头像
function renderAvatar(user){
  // 1. 获取用户的昵称
  var name = user.nickname || user.username
  // 2. 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;$nbsp;'+name) 
  // 3. 按需渲染用户的头像
  if(user.user_pic !== null){
    // 3.1 渲染图片头像
    $('.layui-nav-img').attr('src',user.user_pic).show()
    $('.text-avatar').hide()
  }else{
    // 3.2 渲染文本图像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}