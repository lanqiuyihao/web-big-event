$(function () {
  getUserInfo()

  let layer = layui.layer
  $('#logoutBtn').on('click', function () {
    layer.confirm('您确定要退出吗？', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 1.清空本地存储的token
      localStorage.removeItem('token')
      // 2.跳转到登录页
      location.href = '/login.html'
      layer.close(index)
    })
  })
})

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.code !== 0) return layer.msg('获取用户信息失败')
      renderAvatar(res.data)
    }
  })
}

function renderAvatar(user) {
  // 获取用户名称
  let name = user.nickname || user.username
  // 设置欢迎文本
  $('#welcome').html('欢迎，' + name)
  // 渲染用户头像
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.user-avatar').hide()
  } else {
    $('.user-avatar').html(name[0].toUpperCase()).show()
    $('.layui-nav-img').hide()
  }
}