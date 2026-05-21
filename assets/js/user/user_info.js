$(function () {
  let layer = layui.layer
  let form = layui.form
  form.verify({
    nickname: [/^[\S]{1,6}$/, '昵称必须1到6个字符']
  })
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        form.val('userInfo', res.data)
      }
    })
  }

  initUserInfo()

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    let data = form.val('userInfo')
    $.ajax({
      method: 'put',
      url: '/my/userinfo',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (res) {
        if (res.code !== 0) return layer.msg('修改用户信息失败！')
        layer.msg(res.message)
        window.parent.getUserInfo()
      }
    })
  })

  $('#resetBtn').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })
})
