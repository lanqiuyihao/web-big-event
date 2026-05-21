$(function () {
  let form = layui.form
  let layer = layui.layer
  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    newPass: function (value) {
      let oldPwd = $('[name=old_pwd]').val()
      if (value === oldPwd) {
        return '新旧密码不能相同'
      }
    },
    rePass: function (value) {
      let newPwd = $('[name=new_pwd]').val()
      if (value !== newPwd) {
        return '新密码和确认新密码不一致'
      }
    }
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    let data = form.val('updatePwd')
    $.ajax({
      method: 'PATCH',
      url: '/my/updatepwd',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        $('.layui-form')[0].reset()
      }
    })
  })
})