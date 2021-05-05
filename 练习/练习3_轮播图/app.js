/*
 功能说明:
 1. 点击向右(左)的图标, 平滑切换到下(上)一页
 2. 无限循环切换: 第一页的上一页为最后页, 最后一页的下一页是第一页
 3. 每隔3s自动滑动到下一页
 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
 5. 切换页面时, 下面的圆点也同步更新
 6. 点击圆点图标切换到对应的页

 bug: 快速点击时, 翻页不正常
 */
$(function () {

  var $container = $('#container')
  var $list = $('#list')
  var $points = $('#pointsDiv>span')
  var $prev = $('#prev')
  var $next = $('#next')

  const PAGE_WIDTH = 600
  const TIME = 400
  const ITEM_TIME = 20
  const COUNT = $points.length
  var current_index = 0 //默认第一个按钮
  var moving = false //默认没有翻页

  // 1. 点击向右(左)的图标, 平滑切换到下(上)一页
  //向右翻页
  $next.click(function () {
    clearInterval(auto_timer)
    clickChange(true)
    auto_timer = setInterval(clickChange,3000)
  })

  //向左翻页
  $prev.click(function () {
    clearInterval(auto_timer)
    clickChange(false)
    auto_timer = setInterval(clickChange,3000)
  })

  // 3. 每隔3s自动滑动到下一页
  var auto_timer = setInterval(clickChange,3000)

  // 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
  $container.hover(function () {
    clearInterval(auto_timer)
  },function () {
    auto_timer = setInterval(clickChange,3000)
  })

  // 6. 点击圆点图标切换到对应的页
  $points.click(function () {
    clearInterval(auto_timer)

    //获取到点击按钮的下标
    /*
    * 注意：因为发生点击事件时，调用了动画里的切换按钮函数，所以要 -1
    * */
    var click_current_point = $(this).index() - 1
    //判断大小，来决定动画的方向
    if ($(this).index() > current_index) {
      //定位到点击的按钮
      click_point(click_current_point)
      //第二个参数，决定了图片的偏移量
      clickChange(true,click_current_point+1)
    }else if ($(this).index() < current_index) {
      click_point(click_current_point)
      clickChange(false,click_current_point+1)
    }
    auto_timer = setInterval(clickChange,3000)

  })

  //翻页函数
  function clickChange(next,point_index) {
    //如果正在翻页，点击无效
    if (moving) {
      return
    }
    moving = true //标识正在翻页
    //没有传参，自动轮播
    if (next === undefined) {
      next = true
    }
    /*
    * 总的动画时间：TIME = 400
    * 单元移动的间隔时间：ITEM_TIME = 20
    * 总的偏移量：offset
    * 单元移动的偏移量：offset/(TIME/ITEM_TIME)
    * */
    //动画效果
    //点击按钮 切换图片
    //获取当前列表的位置
    var currentLeft = $list.position().left
    // if (currentLeft === -(COUNT + 1) * PAGE_WIDTH || currentLeft === 0) {
    //   currentLeft = clickChange._currentLeft
    // }

    //没有传第二个参数，则为图片顺序切换
    if (point_index === undefined) {
      var offset = next ? -PAGE_WIDTH : PAGE_WIDTH
    }else {
      //过渡到指定图片
      var offset = next ? -PAGE_WIDTH*(point_index+1-(-currentLeft/PAGE_WIDTH))
          : PAGE_WIDTH*(-(point_index+1-(-currentLeft/PAGE_WIDTH)))
    }

    //单元移动的偏移量
    var item_offset = offset/(TIME/ITEM_TIME)

    //获取目标距离
    var target = currentLeft + offset

    /*
    * 采用自定义动画
    * */

    //第六张1.jpg
    // if (currentLeft === -(COUNT + 1) * PAGE_WIDTH) {
    //   currentLeft = -PAGE_WIDTH
    //   //第一张5.jpg
    // }else if (currentLeft === 0) {
    //   currentLeft = -COUNT * PAGE_WIDTH
    // }
    //
    //   $list
    //       .animate({
    //         left : target
    //       },function () {
    //         moving = false
    //   })


    var timer = setInterval(function () {
      //重新定位
      currentLeft += item_offset
      if (target === currentLeft) {
        //清除定时器
        clearInterval(timer)

        //翻页停止
        moving = false
        //判断当前是第几张图片
        //第六张1.jpg
        if (currentLeft === -(COUNT + 1) * PAGE_WIDTH) {
          currentLeft = -PAGE_WIDTH
          //第一张5.jpg
        }else if (currentLeft === 0) {
          currentLeft = -COUNT * PAGE_WIDTH
        }
      }
      $list.css('left',currentLeft)
    },ITEM_TIME)

    //按钮更新
    $($points[current_index]).removeClass('on')
    if (next === true) {
      current_index++
    }else if(next === false && point_index === undefined){
      current_index--
    }else {
      current_index++
    }

    if (current_index > $points.length - 1) {
      current_index = 0
    }else if (current_index < 0) {
      current_index = $points.length - 1
    }
    $($points[current_index]).addClass('on')

  }

  //点击小按钮
  function click_point(point_index) {
    $($points[current_index]).removeClass('on')
    current_index = point_index
    $($points[current_index]).addClass('on')
  }

})
