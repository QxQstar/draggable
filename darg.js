$(document).ready(function(){
			 var imgArr = Array();
			 //imgwidth和imgheight在拖动滑块时有用
			 var imgWidth = $('.drag').width();
			 var imgHeight = $('.drag').height();
			$(".drag").draggable({ cursor: "move"});
			//使用滑块插件，此时的滑块插件不可用
			$("#slider").slider({
				value: 1,
		  		max:1.5,
		  		min:0.5,
      			orientation: "horizontal",
      			range: "min",
      			step:0.1,
      			disabled: true
			})
			.slider("pips", {
        	first: "pip",
        	last: "pip"
    		});
    		//当左侧印图被点击时，左侧印图容器设为超出隐藏
			$(".drag").on("dragstop",function(event,ui){
				checkInput();
				//当图片进入右边的区域，创建一个新的图片元素，并对这个新创建的图片元素进行操作。
				if($(this).offset().left + $(this).width() > $(".right").offset().left){
					var src = $(this).attr('src');
					var selfData = $(this).attr('selfData');
					var conle = $("<img src='"+src+"' >");
					conle.draggable({ cursor: "move",
						//如果新创建的元素位于右边区域外，将新元素移除
						stop:function(){
							var cur = $(this);
							if(cur.offset().left + cur.width()/2 < $(".right").offset().left){
								cur.fadeOut(300,function(){
									cur.unbind();
									cur.remove()
								});
							}
						}
				});
					//将副本插入到操作台
					$(".right").append(conle);
					conle.css({
						"position":'absolute',
						"top": (ui.offset.top - $(".right").offset().top) + 'px',
						"left": (ui.offset.left - $(".right").offset().left) + 'px'
					});
				}
				//原本的图片回到初始位置
				$(this).css({
					'top':'0',
					'left':'0'
					});
			});
		//检查input的值是否为空，如果为空就移除
		function checkInput(){
			$(".right input").each(function(index,elem){
				if($(elem).val().length <= 0){
					$(this).remove();
				}
			});
		}
		//改变 图片和字体尺寸尺寸的函数
		function changeSize(element,size,width,height){
			if(element.nodeName.toLowerCase() == 'img'){
				$(element).css({
					"width":width*size + "px",
					"height":height*size + "px"
				});
			}
			if(element.nodeName.toLowerCase() == 'input'){
				$(element).css("font-size",width*size + 'px');
			}
		}
		//改变图片和文字颜色图片
		function changeColor(dataColor,element){
			if(element.nodeName.toLowerCase() == 'input'){
				$(element).css("color",dataColor);
			}
			if(element.nodeName.toLowerCase() == 'img'){
				imgArr = [];
				imgSrc = {"src":element.src};
				imgArr.push(imgSrc);
				console.log(imgArr);
			}
		}
		//当操作台里的元素被点击的时候，进行的操作
		$(".right").unbind("click").on("click",function(event){
			var target = event.target;
			var targetName = target.nodeName.toLowerCase();
			$(this).find("img").css("border-style","none");
			//如果被点击的元素是图片时
			if(targetName == 'img'){
				$(target).css({"border-style":"inset","border-color":"#C9C6C6","border-weight":"1px"});
				$("#count").text(Math.ceil($(target).width()/imgWidth * 100) + "%");
				//当点击一个图片后让滑块可用
				$('#slider').slider("option", "disabled", false )
				.slider({
					"value":$(target).width()/imgWidth,
	      			slide:function(event,ui){
	      				$("#count").text( parseInt(ui.value*100) + "%");
	      				changeSize(target,ui.value,imgWidth,imgHeight);
	      			}
				});
				//选中一个图片元素后，点击色块
				$("#colorBlock").unbind("click").on("click",'li',function(event){
					var curColor = event.target;
					var dataColor = $(curColor).attr("data-color");
					changeColor(dataColor,target);
					
				});
				//当选中图片之后，下拉列表不可用
				$("#fontFamily").attr("disabled",true);
			}else if(targetName == 'input'){
			//当选择字体后下拉列表可用
			$("#fontFamily").attr("disabled",false);
			//如果被点击的元素是输入框时
			$("#colorBlock li").text("");
			var newFontSize = parseFloat($(target).css("font-size"));
			//字体的原始大小
			var fontSize = 14;
			$("#count").text(parseInt(newFontSize/fontSize*100) + "%");
			//当点击一个文字后让滑块可用
				$('#slider').slider("option", "disabled", false )
				.slider({
					"value":newFontSize/fontSize,
	      			slide:function(event,ui){
	      				$("#count").text( parseInt(ui.value*100) + "%");
	      				changeSize(target,ui.value,fontSize);
	      				//当滑动滑块时改变input的宽度
	      				var textWidth = ($(target).val().length) * parseInt($(target).css("font-size")) + 10;
						$(target).css("width",textWidth + 'px');
	      			}
				});
				//选中一个文字元素后，点击色块
				$("#colorBlock").unbind("click").on("click",'li',function(event){
					var curColor = event.target;
					var dataColor = $(curColor).attr("data-color");
					changeColor(dataColor,target);
				});
				//让下拉列表显示当前被选文字的字体
				$("#fontFamily").val($(target).css("font-family"));
				//选中一个文字元素后，改变改元素的font-family
				$("#fontFamily").unbind("change").on("change",function(event){
					var fontFamily = $(this).val();
					$(target).css("font-family",fontFamily);
				});
				//让input的宽度等于内容的宽度
				$(target).unbind("keyup").on("keyup",function(event){
					var textWidth = ($(target).val().length) * parseInt($(target).css("font-size")) + 10;
					$(target).css("width",textWidth + 'px');
				});
		}else{
			//当点击右边空白区域，下拉列表不可用
			$("#fontFamily").attr("disabled",true);
			$('#slider').slider("option", "disabled", true );
			$(".right img").css("border-style","none");
			$("#colorBlock li").text("x");
			checkInput();
			$(".right input").css("background-color","rgba(0,0,0,0)");
			$("#colorBlock").unbind("click").on("click",'li',function(event){
					var curColor = event.target;
					var dataColor = $(curColor).attr("data-color");
					changeColor(dataColor,target);
				});
			}
	});
		//操作台被双击输入字体 
		$(".right").unbind("dblclick").on("dblclick",function(event){
			if(event.pageX - $('.right').offset().left >= 40){
				var text = $("<input type='text' id='text'>")
				text.css({"border-style":"none",
						"background-color":"rgba(0,0,0,0.1)",
						"width":"20px",
						"position":"absolute",
						"font-size":"14px",
						"font-family":"微软雅黑",
						"top":event.pageY - $('.right').offset().top + 'px',
						"left":event.pageX - $('.right').offset().left + 'px'
				});
				$('.right').append(text);
				//保存字体的原始大小
				text.draggable({"cursor":"move",
					"cancel":".null"
				});
				//如果文字被拖出操作台，将文字移除
				text.on("dragstop",function(event,ui){
					if($(this).offset().left < $(".right").offset().left){
						$(this).fadeOut(300,function(){
							text.unbind();
							text.remove();
						});
					}
				});
				//当字取得焦点时
				text.unbind("focus").on("focus",function(){
					$(this).css("background-color","rgba(0,0,0,0.1)");
				});
				//当字失去焦点时
				text.unbind("blur").on("blur",function(){
					if($(this).val().length == 0){
						//在移除之前先解除事件
						$(this).unbind();
						$(this).remove();
					}
					$(this).css("background-color","rgba(0,0,0,0)");
				});
			}
		});
		//提交
		$(".tj span").unbind("click").on("click",function(){
		imgArr = [];//清空数组
		$(".right").children("img").each(function(index,element){
			var itemImg = {"offsetLeft":element.offsetLeft,"offsetTop":element.offsetTop,"src":element.src};
			imgArr.push(itemImg);
		});
		console.log(imgArr);
		});
		//选择印图类型
		$(".conn_2").unbind("click").on("click",'a',function(event){
			var target = event.target;
			$(target).parent().siblings().children("a").removeClass('curLink');
			$(target).addClass("curLink");
		});
		//显示更多分类
		$(".more").unbind("click").on("click",function(event){
			var target = event.target;
			if($(target).text() == '更多'){
				$(target).parent().height("60px");
				$(target).parent().prev().height("60px");
				$(target).text("收起");
			}else{
				$(target).parent().height("30px");
				$(target).parent().prev().height("30px");
				$(target).text("更多");
			}
		});
		//当滚动条滚动时
		$("#list").mCustomScrollbar({
			scrollInertia:1000,
			mouseWheelPixels:130,
			scrollEasing:"linear",
			scrollButtons:{
				enable:false,
				scrollType:"continuous",
				scrollSpeed:30,
				scrollAmount:50
			},
			callbacks:{
				
				onTotalScrollOffset:10,
				onTotalScroll:function(){
					$('.warp').css("display","block");
				}
			}
		});
	});