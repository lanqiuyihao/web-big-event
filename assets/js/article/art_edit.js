$(function () {
  let form = layui.form
  let layer = layui.layer

  let params = new URLSearchParams(location.search);
  let id = params.get('id');

  initCate()
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


  getArtDetail(id)

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
  function getArtDetail(id) {
    $.ajax({
      method: 'GET',
      url: '/my/article/info?id=' + id,
      success: function (res) {
        form.val('form-edit', res.data)

        tinymce.activeEditor.setContent(res.data.content)
        $image
          .cropper('destroy')      // 销毁旧的裁剪区域
          .attr('src', 'https://big-event-vue-api-t.itheima.net' + res.data.cover_img)  // 重新设置图片路径
          .cropper(options)        // 重新初始化裁剪区域
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

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    let fd = new FormData($(this)[0])
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        updateArticle(fd)
      })
  })

  function updateArticle(data) {
    $.ajax({
      method: 'PUT',
      url: '/my/article/info',
      data,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.code !== 0) return layer.msg('文章修改失败！')
        layer.msg('文章修改成功！')
        window.parent.initArticleList()
        window.parent.layer.closeAll('iframe')
      }
    })
  }
})