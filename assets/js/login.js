$(function () {
  $('#reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  $('#login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  let form = layui.form
  let layer = layui.layer
  form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次输入的密码不一致'
      }
    }
  })


  form.on('submit(regForm)', function (data) {
    $.ajax({
      method: 'post',
      url: '/api/reg',
      contentType: 'application/json',
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg('注册成功，请登录')
        $('#login').click()
      }
    })
  })

  form.on('submit(loginForm)', function (data) {
    $.ajax({
      method: 'post',
      url: '/api/login',
      contentType: 'application/json',
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        localStorage.setItem('token', res.token)
        location.href= '/index.html'
      }
    })
  })
})


