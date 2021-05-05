/*
 1. 鼠标移入显示,移出隐藏
 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)

 9. 点击向右/左, 移动当前展示商品的小图片
 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */

$(function () {
  showhide()
  hoverSubMenu()
  search()
  share()
  address()
  clickTabs()

  // 6. 点击切换地址tab
  var before_li = 0
  function clickTabs() {
    var $lis = $('#store_tabs > li')

    $lis.click(function () {
      // $lis.each(function () {
      //   /*原生js*/
      //   this.className = ''
      // })
      // this.className = 'hover'

      /*jQuery*/
      $($lis[before_li]).removeClass('hover')
      var current_li = $(this).index()
      before_li = current_li
      $($lis[current_li]).addClass('hover')
    })
  }

  // 5. 鼠标移入移出切换地址的显示隐藏
  function address() {
    var $store_close = $('#store_close')
    $('#store_select').hover(function () {
      $store_close
          .show()
          .prevAll('div:lt(1)').show()
    },function () {
      $store_close
          .hide()
          .prevAll('div:lt(1)').hide()
    })

    $store_close.click(function () {
      $(this)
          .hide()
          .prevAll('div:lt(1)').hide()
    })
  }

  // 4. 点击显示或者隐藏更多的分享图标
  var state = false
  function share() {
    $('#shareMore').click(function () {
      var $parent = $('#shareMore').parent()
      var $b = $('#shareMore > b')
      if (!state) {
        $parent.css('width',200)
        $parent.children('[style]').show()
        $b.addClass('backword')
      }else if (state === true) {
        $parent.css('width',155)
        $parent.children('[style]').hide()
        $b.removeClass()
      }
      state = !state
    })
  }

  // 3. 输入搜索关键字, 列表显示匹配的结果
  function search() {
    $('#txtSearch')
        .on('keyup focus',function () {
      var txt = this.value.trim()
      if (txt) {
        $('#search_helper').show()
      }
    }).blur(function () {
      $('#search_helper').hide()
    })
  }

  // 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
  function hoverSubMenu() {
    $('#category_items > .cate_item').hover(function () {
      $(this).children('.sub_cate_box').show()
    },function () {
      $(this).children('.sub_cate_box').hide()
    })
  }

  // 1. 鼠标移入显示,移出隐藏
  // 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
  function showhide() {
    $('[name = show_hide]').hover(function () {
      var id = this.id + '_items'
      $('#' + id).show()
    },function () {
      var id = this.id + '_items'
      $('#' + id).hide()
    })
  }

})
