(function () {
	function Leaf(){
		this.upBg = "#373737";
		this.downBg = "#373737";
	}
	Leaf.prototype.createLeaf = function(w, h, size,num,flag) {
		this.num = num;
		this.flag = flag;
		var box = document.createElement("div");
			box.style.position = "relative";
			box.style.width = w +"px";
			box.style.height = h +"px";
		var ul = document.createElement("ul");
			ul.style = "background-color: #373737;transform-style: preserve-3d;perspective: 1000px;"
			ul.style.borderRadius = 2/25*w+"px";
			ul.style.width = w +"px";
			ul.style.height = h +"px";
		var span = document.createElement("span");
			span.style = "background-color: #000000;position: absolute;top: 50%;z-index: 2;transform-style: preserve-3d;"
			span.style.marginTop =(-1/75*h/2)+"px";
			span.style.width = w+"px";
			span.style.height = 1/75*h+"px";
		for (var i = 0; i < this.num+1; i++) {
			var li = document.createElement("li");
				li.style = "position: absolute;transform-origin: bottom;transform-style: preserve-3d;"
				li.style.width = w+"px";
				li.style.height = h/2+"px";
				li.style.transform = i==this.num-1? "rotateX(-180deg)": ""
			var span1 = document.createElement("span");
				span1.style = "display: block;text-align: center;color: #fff;overflow: hidden;background:"+this.upBg;
				span1.style.width = w+"px";
				span1.style.height = h/2+"px";
				span1.style.borderRadius = 2/25*w+"px";
				span1.style.fontSize = size+"px";
				span1.style.lineHeight = h+"px";
				span1.innerText = i;
			var span2 = document.createElement("span");
				span2.style = "display: block;text-align: center;color: #fff;overflow: hidden;background:"+this.downBg;
				span2.style.width = w+"px";
				span2.style.height = h/2+"px";
				span2.style.borderRadius = 2/25*w+"px";
				span2.style.fontSize = size+"px";
				span2.style.lineHeight = 0 +"px";
				span2.style.transform = "translateY("+(-h/2)+"px) rotateX(180deg)";
				if(this.flag){
					span2.innerText = i == this.num ? 0 : i + 1;
					console.log(1)
				}else{
					span2.innerText = i == 0 ? this.num : i - 1;
				}

			li.appendChild(span1);
			li.appendChild(span2);
			ul.appendChild(li);
			
			this.lis = ul.getElementsByTagName("li");
		}//for end
		box.appendChild(ul);
		box.appendChild(span);
		
		return box;
	}
	
	Leaf.prototype.pageTurn = function (num){
		if(this.flag){
			var curL = num - 1;
			curL = curL < 0 ? this.num : curL;
			var lastL = curL - 1;
			lastL = lastL < 0 ? this.num : lastL;
		}else{
			var curL = num + 1;
			curL = curL > this.num ? 0 : curL;
			var lastL = curL + 1;
			lastL = lastL > this.num ? 0 : lastL;
		}
		
		for(var i=0;i<this.lis.length;i++){
			this.lis[i].style.zIndex = 0;
			this.lis[i].style.transition = "";
		}
		this.lis[lastL].style.zIndex = 1;
		this.lis[lastL].style.transform = "rotateX(-180deg)";
		this.lis[curL].style.zIndex = 3;
		this.lis[curL].style.transform = "rotateX(0deg)";
		this.lis[num].style.zIndex = 1;
		this.lis[num].style.transform = "rotateX(0deg)";
		this.lis[curL].style.transition = "transform 0.8s";
		this.lis[curL].style.transform = "rotateX(-180deg)";
	}
	
	window.Leaf = Leaf;
})()
