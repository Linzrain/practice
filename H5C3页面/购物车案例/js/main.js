$(function() {
	$("#container").fullpage({
		sectionsColor: ["#fadd67", "#84a2d4", "#ef674d", "#ffeedd", "#d04759", "#84d9ed", "#8ac060"],
		verticalCentered: false,
		navigation: true,
		scrollingSpeed: 1000,
		// 进入某一页时触发
		afterLoad: function(link, index) { //index从1开始,为当前屏幕序列号
			$(".section").eq(index - 1).addClass("on");
			if(index==8){
				$(".more").fadeOut(100);
			}else{
				$(".more").fadeIn(100);
			}
		},
		// 离开某一页时触发
		onLeave: function(index, nextIndex) {
			if (index == 2 && nextIndex == 3) {
				$(".section").eq(index - 1).addClass("leave");
			}
			if (index == 3 && nextIndex == 4) {
				$(".section").eq(index - 1).addClass("leave");
			}
			if(index==5&&nextIndex==6){
				$(".section").eq(index-1).addClass("leave");
				$(".screen06 .box").addClass("show");
			}
			if(index==6&&nextIndex==7){
				$(".screen07 .star img").each(function(idx){
					$(this).css("transition-delay",idx*0.5+"s")
				});
			}
		},
		// 页面结构生成后的回调函数,或者说页面初始化完成后的回调函数
		afterRender: function() {
			// 下一页的点击事件
			$(".more").on("click", function() {
				$.fn.fullpage.moveSectionDown()
			});
			// 当第四屏的购物车动画结束之后执行收货地址的动画
			$(".screen04 .cart").on("transitionend", function() {
				$(".screen04 .text").addClass("show");
				$(".screen04 .address").show().find("img:last").fadeIn(1000);
			});
			// 第八屏功能
				// 手跟着鼠标动
			$(".screen08").on("mousemove",function(e){
				$(this).find(".hand").css({
					left: e.clientX-70,
					top:e.clientY+10
				});
			}).find(".again").click(function(){
				/*2.点击再来一次重置动画跳回第一页*/
				// 加on leave show 类
				// 加css属性、用jquery方法show()fadeIn() 后果：加一个style属性
				$(".on,.leave,.show").removeClass("on leave show")
				$(".content [style]").removeAttr("style");
				// 移动到第一屏
				$.fn.fullpage.moveTo(1);
			});
		}
	});

})
