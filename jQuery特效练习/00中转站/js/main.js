(function() {

	function LiGroup($obj, num) {
		this.liNum = num || 125;
		this.viewZ = -1000;
		this.arr = [];
		for (var i = 0; i < num; i++) {
			var $li = $("<li></li>");
			this.arr[i] = $li;
			$li.appendTo($obj)
		}
		this.gridState = true;
		this.helixState = true;
		this.sphereState = true;
		this.tableState = true;
		this.currentStyle = "grid";
		this.$parent = $obj;
		//获得随机数组和样式的对象
		this.random = function() {
			var copyArr = [],
				randomArr = [],
				arrCss = [];
			for (var i = 0; i < this.liNum; i++) {
				copyArr[i] = this.arr[i]
				arrCss[i] = this.arr[i].css("transform")
			}
			for (var i = 0; i < this.liNum; i++) {
				var randomIndex = parseInt(Math.random() * (this.liNum - i));
				randomArr.push(copyArr.splice(randomIndex, 1)[0])
			}
			return {
				Arr: randomArr,
				cssArr: arrCss
			}
		}
		//移除动画效果
		this.stopAnimate = function() {
			liGroup.arr.forEach(function(ele) {
				ele.css({
					"transition": "transform 0s"
				})
			})
		}
		//添加动画效果
		this.startAnimate = function(value) {
			var valueTrue = value || "transform 3s ease-in-out 0s"
			liGroup.arr.forEach(function(ele) {
				ele.css({
					"transition": valueTrue
				})
			})
		}
	}

	//初始化
	LiGroup.prototype.init = function(obj) {
		for (var i = 0; i < this.liNum; i++) {
			var randomX = (Math.random() - 0.5) * 5000;
			var randomY = (Math.random() - 0.5) * 5000;
			var randomZ = (Math.random() - 0.5) * 5000;

			this.arr[i].css({
				"transform": "translate3d(" + randomX + "px," + randomY + "px," + randomZ + "px)"
			})
		}
		
		/******************用于制作中的标识,可去掉*******************/
							//第一个li的颜色
							this.arr[0].css({
								"background": "red"
							});
							//最后一个li的颜色
							this.arr[this.liNum - 1].css({
								"background": "blue"
							});
		/******************用于制作中的标识,可去掉*******************/
		
		this.liWidth = this.arr[0].width();
		this.liHeight = this.arr[0].height();
		setTimeout(function() {
			liGroup.startAnimate();
			liGroup.grid(liGroup.arr, obj);
		}, 50);
	}

	//鼠标拖拽,使目标旋转
	LiGroup.prototype.viewMove = function($doc) {
		var nowX, lastX, minusX = 0,
			nowY, lastY, minusY = 0;
		var sumX = 0,
			sumY = 0,
			b = 0.2; //b用于旋转角度的倍数,可动态变化
		var timeId1, timeId2;
		var tar = $doc||this.$parent.parent()

		tar.mousedown(function(e) { //鼠标点击事件
			var ev = e || window.event;
			clearInterval(timeId1); //先清除惯性
			lastX = ev.clientX;
			lastY = ev.clientY;
			$(this).on("mousemove.vMove", function(e) { //鼠标拖拽事件
				var ev = e || window.event;
				nowX = ev.clientX;
				nowY = ev.clientY;
				minusX = nowX - lastX; //在移动的瞬间,移动的距离。一般程序执行周期需要时间,所以鼠标移动速度越大，则差值越大
				minusY = nowY - lastY;
				b = (2000 - liGroup.viewZ) / (2000 + 2000) * 0.15 + 0.05;
				sumX += minusX * b;
				sumY += minusY * b;
				lastX = nowX;
				lastY = nowY;
				liGroup.$parent.css({
					"transform": "translateZ(" + liGroup.viewZ + "px) rotateX(" + (-sumY) + "deg) rotateY(" + sumX + "deg)"
				});
			});
		}).mouseup(function() { //鼠标弹起事件
			$(this).off("mousemove.vMove"); //弹起后取消鼠标移拖拽
			timeId1 = setInterval(function() { //鼠标拖拽后目标的惯性旋转
				minusX *= 0.95;
				minusY *= 0.95;
				sumX += minusX * b;
				sumY += minusY * b;
				if (Math.abs(minusX) < 0.5 && Math.abs(minusY) < 0.5) { //惯性的旋转速度过小时取消惯性定时器
					clearInterval(timeId1);
					minusX = 0;
					minusY = 0;
				}
				liGroup.$parent.css({
					"transform": "translateZ(" + liGroup.viewZ + "px) rotateX(" + (-sumY) + "deg) rotateY(" + sumX + "deg)"
				});
			}, 13);
		}).on("mousewheel", function() { //滚轮滚动事件
			clearInterval(timeId2)
			var dZ = arguments[1];
			liGroup.viewZ += dZ * 80;
			liGroup.viewZ = liGroup.viewZ > 1500 ? 1500 : liGroup.viewZ;
			liGroup.viewZ = liGroup.viewZ < -6000 ? -6000 : liGroup.viewZ;

			liGroup.$parent.css({
				"transform": "translateZ(" + liGroup.viewZ + "px) rotateX(" + (-sumY) + "deg) rotateY(" + sumX + "deg)"
			})
			timeId2 = setInterval(function() {
				dZ *= 0.85;
				if (Math.abs(dZ) < 0.01) {
					clearInterval(timeId2);
				}
				liGroup.viewZ += dZ * 20;
				liGroup.viewZ = liGroup.viewZ > 1500 ? 1500 : liGroup.viewZ;
				liGroup.viewZ = liGroup.viewZ < -6000 ? -6000 : liGroup.viewZ;
				liGroup.$parent.css({
					"transform": "translateZ(" + liGroup.viewZ + "px) rotateX(" + (-sumY) + "deg) rotateY(" + sumX + "deg)"
				})
			}, 13)
		});
	}

	//立体网格特效
	LiGroup.prototype.grid = function(arr, obj) {
		var gapX = obj.gapX || 200,
			gapY = obj.gapY || 200,
			gapZ = obj.gapZ || 800; //x、y、z间隔;
		var rowNum = obj[rowNum] || 5,
			colNum = obj[colNum] || 5,
			pagesNum = Math.ceil(this.liNum / (rowNum * colNum)) || 5; //页数、行数、列数;


		if (colNum % 2 == 0) { //列
			var mulX = colNum / 2;
			var firstX = -(gapX * mulX + this.liWidth * mulX - gapX / 2 - this.liWidth / 2) //第一个li移动的x距离(偶数列)
		} else {
			var mulX = parseInt(colNum / 2);
			var firstX = -(gapX * mulX + this.liWidth * mulX) //第一个li移动的x距离(奇数列)
		} //if end
		if (rowNum % 2 == 0) { //行
			var mulY = rowNum / 2;
			var firstY = -(gapY * mulY + this.liHeight * mulY - gapY / 2 - this.liHeight / 2) //第一个li移动的y距离(偶数行)
		} else {
			var mulY = parseInt(rowNum / 2);
			var firstY = -(gapY * mulY + this.liHeight * mulY) //第一个li移动的y距离(奇数行)
		} //if end
		if (pagesNum % 2 == 0) { //页
			var mulZ = pagesNum / 2;
			var firstZ = -(gapZ * mulZ - gapZ / 2) //第一个li移动的z距离(偶数页)
		} else {
			var mulZ = parseInt(pagesNum / 2);
			var firstZ = -(gapZ * mulZ) //第一个li移动的z距离(奇数页)
		} //if end

		arr.forEach(function(ele, i) {
			var iX = (i % (rowNum * colNum)) % colNum;
			var iY = parseInt((i % (rowNum * colNum)) / colNum);
			var iZ = parseInt(i / (rowNum * colNum));

			ele.css({
				"transform": "translate3d(" + (firstX + iX * (gapX + liGroup.liWidth)) + "px," + (firstY + iY * (gapY +
					liGroup.liHeight)) + "px," + (
					firstZ + iZ * gapZ) + "px)"
			});
		});
	}

	//立体螺旋梯特效
	LiGroup.prototype.helix = function(arr) {
		var roY = 10,
			tY = 10;
		var midIndex = parseInt(this.liNum / 2);
		var topOneY = -midIndex * tY;

		arr.forEach(function(ele, i) {
			ele.css({
				"transform": "rotateY(" + roY * i + "deg) translateY(" + (topOneY + tY * i) + "px) translateZ(" + 1000 +
					"px)"
			})
		})
	}

	//立体球特效
	LiGroup.prototype.sphere = function(arr) {
		var sArr = [];
		var n = Math.ceil((1 + Math.sqrt(1 - 4 * (1 - this.liNum + 1))) / 2); //总项数
		n = n % 2 == 0 ? n + 1 : n;
		for (var i = 1; i <= n; i++) {
			if (i <= (n - 1) / 2) {
				sArr.push(4 * i - 3)
			} else if (i == (n + 1) / 2) {
				sArr.push(this.liNum - (n * n - 3 * n + 2))
			} else {
				sArr.push(4 * (n - i) + 1)
			}
		}
		//设置中间五项,使其比较均匀点
		var midI = (n + 1) / 2 - 1; //中间的索引值
		var total = sArr[midI] + sArr[midI - 1] * 2 + sArr[midI - 2] * 2;
		var avg = total / 5;
		sArr[midI - 2] = sArr[midI + 2] = Math.floor(avg);
		sArr[midI - 1] = sArr[midI + 1] = Math.ceil(avg);
		sArr[midI] = total - sArr[midI - 1] * 2 - sArr[midI - 2] * 2;
		var firstX = 90;
		arr.forEach(function(ele, idx) {
			var sum = 0;
			var arrIdx, num
			for (var i = 0; i < liGroup.liNum; i++) {
				sum += sArr[i];
				if (sum >= idx + 1) {
					arrIdx = i;
					num = sArr[i] - (sum - idx) + 1
					break;
				}
			}
			var roY = 360 / sArr[arrIdx];
			var roX = 90 / ((n - 1) / 2)

			ele.css({
				"transform": "rotateY(" + (roY * num) + "deg) rotateX(" + (firstX - roX * arrIdx) + "deg) translateZ(" + (800 +
						liGroup.liNum) +
					"px)"
			})
		})
	}

	//立体桌面特效
	LiGroup.prototype.table = function(arr) {
		var lineNum = (3 + (this.liNum - 18) / 18); //行数
		var gapX = 30,
			gapY = 30;
		var firstX = -(this.liWidth * 9 + gapY * 9 - this.liWidth / 2 - gapY / 2);
		if (lineNum % 2 == 0) { //行
			var mulY = lineNum / 2;
			var firstY = -(gapY * mulY + this.liHeight * mulY - gapY / 2 - this.liHeight / 2); //第一个li移动的y距离(偶数行)
		} else {
			var mulY = parseInt(lineNum / 2);
			var firstY = -(gapY * mulY + this.liHeight * mulY); //第一个li移动的y距离(奇数行)
		} //if end
		var arr18 = [{
				x: firstX,
				y: firstY
			},
			{
				x: firstX + 17 * (this.liWidth + gapX),
				y: firstY
			},
			{
				x: firstX,
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + 12 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + 13 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + 14 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + 15 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + 16 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX + 17 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY)
			},
			{
				x: firstX,
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + 12 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + 13 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + 14 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + 15 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + 16 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			},
			{
				x: firstX + 17 * (this.liWidth + gapX),
				y: firstY + (this.liHeight + gapY) * 2
			}
		];
		arr.forEach(function(ele, idx) {
			if (idx < 18) {

				ele.css({
					"transform": "translate3d(" + arr18[idx].x + "px," + arr18[idx].y + "px,0px)"
				})
			} else {
				var cmulX = (idx - 18) % 18,
					cmulY = parseInt((idx - 18) / 18) + 3;
				ele.css({
					"transform": "translate3d(" + (firstX + (liGroup.liWidth + gapX) * cmulX) + "px," + (firstY + (liGroup.liHeight +
							gapY) *
						cmulY) + "px,0px)"
				})
			}
		})

	}

	//混淆顺序(无动画,只是把位置随机互换了下)
	LiGroup.prototype.obscure = function() {
		this.stopAnimate()
		var randomArr = this.random().Arr;
		randomArr.forEach(function(ele, i) {
			ele.css({
				"transform": liGroup.arrCss[i]
			})
		})
	}



	window.LiGroup = LiGroup;
})()
