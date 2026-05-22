$(function () {
  template.defaults.imports.formatDate = function (value) {
    let dt = new Date(value)
    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())
    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  let form = layui.form
  let laypage = layui.laypage
  let layer = layui.layer
  let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  window.initArticleList = function () {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }
  initArticleList()
  initCate()


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

  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    q = Object.assign(q, form.val('form-search'))
    initArticleList()
  })

  function renderPage(total) {
    laypage.render({
      elem: 'pages',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        if (!first) {
          q.pagenum = obj.curr
          q.pagesize = obj.limit
          initArticleList()
        }
      }
    })
  }

  $('tbody').on('click', '.btn-delete', function () {
    let len = $('.btn-delete').length
    let id = $(this).attr('data-id')
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'delete',
        url: '/my/article/info?id=' + id,
        success: function (res) {
          if (res.code !== 0) return layer.msg('删除文章失败！')
          layer.msg('删除文章成功！')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initArticleList()
        }
      })
      layer.close(index)
    })
  })
  $('tbody').on('click', '.btn-edit', function () {
    let id = $(this).attr('data-id')
    indexEdit = layer.open({
      title: '编辑文章',
      type: 2,
      area: ['100%', '100%'],
      content: '/article/art_edit.html?id=' + id
    })
  })
})