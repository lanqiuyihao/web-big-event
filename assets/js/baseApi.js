$.ajaxPrefilter(function (options) {
  options.url = 'http://big-event-vue-api-t.itheima.net' + options.url

  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  options.complete = function (res) {
    if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
      // 清空token
      localStorage.removeItem('token')
      // 跳转到登录页
      location.href = '/login.html'
    }
  }
})