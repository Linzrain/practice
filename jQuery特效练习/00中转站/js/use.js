$(function() {
	// 创建liGroup对象
	liGroup = new LiGroup($("#box"), 125);

	//网格特效的间隔和行列数
	var obj = {
		gapX: 300,
		gapY: 300,
		gapZ: 600,
		rowNum: 5,
		colNum: 5
	};

	//初始化
	liGroup.init(obj);

	// 启动视角控制
	liGroup.viewMove($(document));

	//改变样式属性使#styleBtn有动画效果
	$('#styleBtn').css({
		transform: 'scale(1)',
		opacity: 1
	});

	//为每个li添加内容
	liGroup.arr.forEach(function(ele, index) { //为li添加内容
		//判断demoArr数组某个长度上是否存在元素
		if (demoArr[index] == undefined) {
			var title = demoArr[0].title;
			var author = demoArr[0].author;
			var date = demoArr[0].date;
		} else {
			var title = demoArr[index].title;
			var author = demoArr[index].author;
			var date = demoArr[index].date;
		}
		ele.html("<span class='index'>" + (index + 1) + "</span><p class='title'>" + title +
			"</p><p class='author'>" + author +
			"</p><p class='time'>" + date + "</p>")
	})

	//改变风格的函数（可切换有序和无序）
	function changeTo(type, obj) {
		liGroup.startAnimate("transform 0.5s ease-in-out 0s");
		var flag = type + "State"
		if (liGroup.currentStyle != type) { //切换其他风格使就有序排列
			liGroup[flag] = true;
			liGroup[type](liGroup.arr, obj);

		} else { //同样风格就在有序无序中切换
			if (liGroup[flag] == true) {
				liGroup[flag] = false;
				liGroup[type](liGroup.random().Arr, obj);
			} else if (liGroup[flag] == false) {
				liGroup[flag] = true;
				liGroup[type](liGroup.arr, obj);
			} else {
				return
			}
		}
		liGroup.currentStyle = type;
	}

	//阻止#styleBtn里的li冒泡
	$("#styleBtn li").on("click mousemove", function(e) {
		var ev = e || window.event;
		ev.stopPropagation();
	})

	// #styleBtn下的$li点击事件,用于切换风格
	$("#styleBtn li").click(function(e) { //鼠标点击事件
		switch ($(this).index()) { //通过索引值判断要切换的风格
			case 0:
				changeTo("table")
				break;
			case 1:
				changeTo("sphere")
				break;
			case 2:
				changeTo("helix")
				break;
			case 3:
				changeTo("grid", obj)
				break;
		}
	});

	var $li = $("#box li");
	var $show = $("#show");

	//点击#box下的$li使$show出现
	$li.click(function(e) {
		var ev = e || window.event;
		ev.stopPropagation();
		var idx = $(this).index();

		if (demoArr[idx] == undefined) {
			var topic = "暂无";
			var author = "暂无";
			var dec = "暂无";
			var fsrc = demoArr[0].fsrc;
			var picsrc = "imgs/暂无图片.jpg"
		} else {
			var topic = demoArr[idx].topic;
			var author = demoArr[idx].author;
			var dec = demoArr[idx].dec;
			var fsrc = demoArr[idx].fsrc;
			var picsrc = "imgs/" + (idx + 1) + ".jpg"
		}

		$(".s-topic").text("标题：" + topic)
		$(".s-author").text("作者：" + author)
		$(".s-dec").text("简述：" + dec)
		$("#frame").find('iframe').attr("src", fsrc);
		$(".s-img").attr("src", picsrc);

		//使$show出现
		$show.stop(false, true).fadeIn(1000).css({
			transform: "rotateY(0deg) scale(1)"
		});
		
		//创建隐藏$show的方式
		showHide();
	});

	//点击$container隐藏$show的函数
	function showHide() {
		$("#container").on("mousedown.showHide", function() {
			//鼠标移动事件
			$(this).one("mousemove.one", function() {
				//点击后鼠标移动就隐藏$show
				$show.stop().fadeOut(1000, function() {
					$(this).css({
						transform: "rotateY(0deg) scale(1.5)"
					});
				}).css({
					'transform': 'rotateY(180deg) scale(0.1)'
				});
				$("#container").off("mousedown.showHide mouseup.hide") //移除点击$container隐藏$show的方式
			});
			// 鼠标弹起事件
			$(this).on("mouseup.hide", function() {
				//点击后鼠标弹起就隐藏$show
				$show.stop().fadeOut(1000, function() {
					$(this).css({
						transform: "rotateY(0deg) scale(1.5)"
					});
				}).css({
					'transform': 'rotateY(180deg) scale(0.1)'
				});
				$(this).off("mousedown.showHide mousemove.one mouseup.hide") //移除点击$container隐藏$show的方式
			});
		});
	}

	//阻止$show冒泡
	$show.on("click mousemove mousedown", function(e) {
		var ev = e || window.event;
		ev.stopPropagation();
	});

	//$show下的$s-img点击事件
	$show.find(".s-img").click(function() {
		//#container向左移动100%
		$("#container").stop(true).animate({
			"marginLeft": "-100%"
		}, 1000, function() {
			$show.stop().css({
				display: "none",
				transform: "rotateY(0deg) scale(1.5)"
			});
		});
		
		// window.parent.frames.iframe1.location.reload(); //刷新ifame的js办法
		$('#frameContent').attr('src', $('#frameContent').attr('src'));//刷新ifame的jQuery办法
		
		//#frame向左移动100%
		$('#frame').show().animate({
			"left": "0px"
		}, 1000);
	});

	//$back点击事件
	$("#back").click(function(e) {
		var ev = e || window.event;
		ev.stopPropagation();
		$("#container").stop(true).animate({
			marginLeft: "0"
		}, 1000);
		$('#frame').stop(true).animate({
			left: "100%"
		}, 1000, function() {
			$("#frame").css("display", "none")
		});
	});
});
