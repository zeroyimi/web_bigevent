
// 每次调用 $.get 或$.post 或$.ajax的时候，会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options){
  // 再发起真正的Ajax请求之前,同意拼接请求的根路径 
  options.url = "http://127.0.0.1:3007"+options.url
  console.log(options.url)
  
})