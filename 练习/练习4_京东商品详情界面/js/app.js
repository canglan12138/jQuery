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
  const PICTURE_WIDTH = 62

  showhide()
  hoverSubMenu()
  search()
  share()
  address()
  clickTabs()
  hoverMiniCart()
  clickProductTabs()
  moveMiniImg()
  hoverMiniImg()
  bigImg()

  // 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
  function bigImg() {
    var $mediumImg = $('#mediumImg')
    var $mask = $('#mask') //小黄块
    var $maskTop = $('#maskTop')
    var $largeImgContainer = $('#largeImgContainer')
    var $loading = $('#loading')
    var $largeImg = $('#largeImg')

    const mask_width = $mask.width()
    const mask_height = $mask.height()

    var maskTop_height = $maskTop.height()
    var maskTop_width = $maskTop.width()

    $maskTop.hover(function () {

      /*移动小黄块*/
      $mask.show()

      //动态获取大图
      var src = $mediumImg.attr('src').replace('-m','-l')
      $largeImg.attr('src',src)
      $largeImgContainer.show()

      $largeImg.on('load',function () { //大图加载完成

        //得到大图的尺寸
        var large_width = $largeImg.width()
        var large_heigt = $largeImg.height()

        //设置大图容器的尺寸
        $largeImgContainer.css({
          width : large_width/2,
          height : large_heigt/2
        })

        //显示大图
        $largeImg.show()
        //隐藏加载进度条
        $loading.hide()

        //鼠标移动的监听
        $maskTop.mousemove(function (event) {
          var event_top = event.offsetY
          var event_left = event.offsetX

          var top = 0
          var left = 0

          top = event_top - mask_height/2
          left = event_left - mask_width/2

          //让小黄块在图片中移动
          if (left < 0) {
            left = 0
          }else if (left > maskTop_width - mask_width) {
            left = maskTop_width - mask_width
          }

          if (top < 0) {
            top = 0
          }else if (top > maskTop_height - mask_height) {
            top = maskTop_height - mask_height
          }
          //给$mask重新定位
          $mask.css({
            top : top,
            left : left
          })

          /*移动大图*/

          //设置大图的坐标
          top = -top * large_width/maskTop_width
          left = -left * large_heigt/maskTop_height

          //移动大图
          $largeImg.css({
            top : top,
            left : left
          })

        })
      })

    },function () {
      $mask.hide()
      $largeImg.hide()
      $largeImgContainer.hide()
    })
  }

  // 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
  function hoverMiniImg() {
    var $li_imgs = $('#icon_list > li > img')
    var $mediumImg = $('#mediumImg')
    $li_imgs.hover(function () {
      this.className = 'hoveredThumb'
      var src_m = this.src.replace('.jpg','-m.jpg')
      $mediumImg[0].src = src_m
    },function () {
      this.className = ''
    })
  }


  // 9. 点击向右/左, 移动当前展示商品的小图片
  function moveMiniImg() {
    var $pre = $('#preview > h1 >a:eq(0)')
    var $next = $('#preview > h1 >a:eq(1)')
    var $icon_list = $('#preview > h1 > div > #icon_list')

    //默认显示下一个箭头
    $next.removeClass().addClass('forward')

    //获取图片列表的位置
    var icon_list_left = $icon_list.position().left

    //下一张
    $next.click(function () {
      //如果超出范围，取消点击事件
      if (icon_list_left < -3 * PICTURE_WIDTH) {
        return
      }
      //图片移动
      changePicture(true,icon_list_left)

      //左按钮显示
      $pre.removeClass().addClass('backward')

      //重新获取图片移动后的距离
      icon_list_left = $icon_list.position().left
      if (icon_list_left < -3 * PICTURE_WIDTH) {
        //超出距离 按钮隐藏
        $next.removeClass().addClass('forward_disabled')
      }
    })

    //上一张
    $pre.click(function () {
      if (icon_list_left === 0) {
        return
      }

      changePicture(false,icon_list_left)
      $next.removeClass().addClass('forward')

      icon_list_left = $icon_list.position().left
      if (icon_list_left === 0 ) {
        $pre.removeClass().addClass('backward_disabled')
      }
    })

    //切换图片函数
    function changePicture(bool,icon_list_left) {
      var current_icon_list_left = bool ? icon_list_left - 62 : icon_list_left + 62
      //图片列表移动
      $icon_list.css('left',current_icon_list_left)
    }
  }


  // 8. 点击切换产品选项 (商品详情等显示出来)
  var currentindex = 0
  function clickProductTabs() {
    var $product_detail = $('#product_detail')
    var $lis = $('#product_detail > .main_tabs > li')
    var $divs = $product_detail.children('div:not(:first)')

    /*点击标签改变样式*/
    $lis.click(function () {
      $($divs[currentindex]).hide()
      currentindex = $(this).index()
      $lis.removeClass('current')
      $(this).addClass('current')

      //显示商品详情
      $divs[currentindex].style.display = 'block'
    })

  }

  // 7. 鼠标移入移出切换显示迷你购物车
  function hoverMiniCart() {
    var $minicart = $('#minicart')
    var $minicart_div = $('#minicart > div')

    $minicart.hover(function () {
      $minicart.addClass('minicart')
      $minicart_div.show()
    },function () {
      $minicart.removeClass('minicart')
      $minicart_div.hide()
    })
  }

  // 6. 点击切换地址tab
  //默认选中第一个标签的下标
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
      //清除标签样式
      $($lis[before_li]).removeClass('hover')

      //获取到当前点击的标签的下标
      var current_li = $(this).index()

      //保存当前点击标签的下标
      before_li = current_li

      //点击的标签切换样式
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

    //点击右上角的 x 地址关闭
    $store_close.click(function () {
      $(this)
          .hide()
          .prevAll('div:lt(1)').hide()
    })
  }

  // 4. 点击显示或者隐藏更多的分享图标
  //默认隐藏
  var state = false

  function share() {
    $('#shareMore').click(function () {
      var $parent = $('#shareMore').parent()
      var $b = $('#shareMore > b')

      /*
      * 如果隐藏，让其显示
      * */
      if (!state) {
        $parent.css('width',200)
        $parent.children('[style]').show()
        $b.addClass('backword')
      }else{
        $parent.css('width',155)
        $parent.children('[style]').hide()
        $b.removeClass()
      }

      //更改显示状态
      state = !state
    })
  }

  // 3. 输入搜索关键字, 列表显示匹配的结果
  function search() {
    $('#txtSearch')
        //绑定keyup focus 事件
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
