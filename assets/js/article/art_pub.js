$(function () {
  let form = layui.form
  let layer = layui.layer
  // 渲染文章分类
  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 封面裁剪
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success: function (res) {
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  $('#selectCover').on('click', function () {
    $('#file').click()
  })

  $('#file').on('change', function (e) {
    let file = e.target.files[0]
    let newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  let art_state = '已发布'

  $('#submit2').on('click', function () {
    art_state = '草稿'
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    let fd = new FormData($(this)[0])
    fd.append('state', art_state)
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        pubArticle(fd)
      })
  })

  function pubArticle(data) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      contentType: false,
      processData: false,
      data,
      success: function (res) {
        if (res.code !== 0) return layer.msg('发布文章失败！')
        layer.msg('发布文章成功！')
        window.parent.document.querySelector('.layui-this').className = ''
        window.parent.document.querySelector('.layui-icon-list').closest('dd').className = 'layui-this'
        location.href = '/article/art_list.html'
      }
    })
  }
})