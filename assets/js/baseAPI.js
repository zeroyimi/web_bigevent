
// 每次调用 $.get 或$.post 或$.ajax的时候，会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options){
  // 再发起真正的Ajax请求之前,同意拼接请求的根路径 
  options.url = "http://127.0.0.1:3007"+options.url
  // 统一为有权限的接口，，设置header请求头
  if(options.url.indexOf('/my/')!==-1){    
    options.headers = {
      // 获取存储到本地存储中的token
      Authorization: localStorage.getItem("token") || ''
    }
  };
  // 全局挂载 complete 回调函数
  options.complete = function(res){
    // 在conplete回调函数中，可以使用res.responseJSON拿到服务器响应的数据
    if(res.responseJSON.status===1&&res.responseJSON.message==="身份验证失败")
    // 1. 强制清空token
    localStorage.removeItem('token')
    // 2. 强制跳转到登录界面
    location.href="./login.html"
  }
})