$(function(){
  // 点击去注册账号的连接
  $("#link_reg").on("click",function(){
    $(".login-box").hide()
    $(".reg-box").show()
  })
  // 点击去登陆的链接
  $("#link_login").on('click',function(){
    $(".login-box").show()
    $(".reg-box").hide()
  })
  
  // 从layui中获取form对象
  // 只要导入layui就有layui对象可以使用
  var form = layui.form
  var layer = layui.layer
  // 通过 form.verify()函数自定义校验规则
  form.verify({
    // 自定义了一个叫做pwd的校验规则
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致的规则
    repwd: function(value){
      // 通过形参拿到的是确认密码框中的内容，需要拿到密码框中的内容，进行一次等于判断，如果判断失败，则return一个提示消息即可
      var pwd = $(".reg-box [name=password]").val()
      if(pwd !== value){
        return '两次密码不一致'
      }
    }
  })
  
  // 监听注册表单的提交事件
  $('#form_reg').on('submit',function(e){
    e.preventDefault()
    var data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
    $.post('/api/reguser',data,function(res){
      if(res.status !== 0){
        return layer.msg(res.message)
      }
      layer.msg('注册成功,请登录！')
      // 模拟人的点击行为
      $("#link_login").click()
    })
  })

  // 监听登录表单的提交事件
  $("#form_login").submit(function(e){
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/api/login',
      // 快速获取表单中的数据
      data:$(this).serialize(),
      success: function(res){
        // 等于0就是成功，不等于0就是失败
        if(res.status!==0){
          return layer.msg('登陆失败')
        }
        layer.msg("登陆成功！")
        // 将登陆得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token',res.token)
        location.href='./index.html'
      }
    })
  })
  // 把登录注册页面上传到github教程链接: https://www.bilibili.com/video/BV1V341127i6?p=83&spm_id_from=pageDriver&vd_source=581c2290672fc158cff6d68853cd37ac
  // 每个页面需要创建对应的分支
  // git checkout -b index 创建分支
  // git branch 查看分支
})

