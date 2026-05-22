$(function () {
  let layer = layui.layer
  let form = layui.form
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success: function (res) {
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  initArtCateList()

  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '300px'],
      content: $('#dialog-add').html()
    })
  })

  $('body').on('submit', '#addForm', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'post',
      url: '/my/cate/add',
      contentType: 'application/json',
      data: JSON.stringify(form.val('addForm')),
      success: function (res) {
        if (res.code !== 0) return layer.msg('添加分类失败！')
        layer.msg('添加分类成功！')
        initArtCateList()
        layer.close(indexAdd)
      }
    })
  })
  let indexEdit = null
  $('tbody').on('click', '#btnEdit', function () {
    indexEdit = layer.open({
      title: '修改文章分类',
      type: 1,
      area: ['500px', '300px'],
      content: $('#dialog-edit').html()
    })
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/cate/info',
      data: { id },
      success: function (res) {
        form.val('editForm', res.data)
      }
    })
  })

  $('body').on('submit', '#editForm', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'PUT',
      url: '/my/cate/info',
      data: JSON.stringify(form.val('editForm')),
      contentType: 'application/json',
      success: function (res) {
        if (res.code !== 0) return layer.msg('更新分类数据失败！')
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  $('tbody').on('click', '#btnDelete', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
      //do something

      $.ajax({
        method: 'DELETE',
        url: '/my/cate/del?id=' + id,
        success: function (res) {
          if (res.code !== 0) return layer.msg('删除分类数据失败！')
          layer.msg('删除分类数据成功！')
          initArtCateList()
        }
      })
      layer.close(index);
    })
  })
})
