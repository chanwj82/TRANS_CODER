// 20160122 기기체크
var mobilecheck = function () {
     var check = false;
     (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
     return check;
}
if(mobilecheck()){
$("head").append('<link type="text/css" rel="stylesheet" href="/css/main_re_m.css"/>')

}

/* RESIZE */
$(window).load(function(){

var theWindow = $(window);
var bg = $(".bg img");
var aspectRatio = bg.width()/bg.height();

function resizeBg(){
	if((theWindow.width()/theWindow.height()) < aspectRatio){
	bg.removeClass().addClass("bgheight");
	var bgWid = bg.width()/2;
	bg.css({"margin-left":-bgWid + "px",
			"margin-top":0
			})
}else{
	bg.removeClass().addClass("bgwidth");
	var bgHeight = bg.height()/2;
	bg.css({"margin-top":-bgHeight + "px",
			"margin-left":0
			})
}
}
	$(window).resize(function(){
		var aspectRatio = bg.width()/bg.height();
		resizeBg();
	}).trigger("resize");

})


$(document).ready(function(){
/* gnb */
	$("#gnb .dep1").mouseover(function(){
		$("#gnb .dep1").each(function(){
			$(this).removeClass("on");
		});
		$(this).addClass("on");
	});
	$("#gnb").mouseleave(function(){
		$("#gnb .dep1").each(function(){
			$(this).removeClass("on");
		});
	});
/* footer */
	$(".f_site .heading").click(function(){
		if(!$(this).siblings("ul").hasClass("on")){
			$(this).siblings("ul").addClass("on");
		}else{
			$(this).siblings("ul").removeClass("on");
		}
	});
	$(".f_site").mouseleave(function(){
		$(this).children("ul").removeClass("on");
	});
});


var search_on = "off"; // get 파라미터 값(slide)이 있는 지 체크

$(document).ready(function() {
	var _length = $("#scroll_mov #container .cont").length; //컨텐츠 최대개수
	var _count = 0;
	var targetHeight = $(window).height();//화면높이;

	$(".paginate li").each(function(i){
		$(this).attr("data-index",i)
	});
	var wheeling = "off"; // 마우스 휠 중복 방지 값

	//초기위치
	$("#scroll_mov #container .cont").height(targetHeight);//컨텐츠 1개높이
	$("#scroll_mov #container .cont .cont_in").height(targetHeight);
	$("#scroll_mov #container").height(targetHeight*_length);

	//마우스 휠 이벤트
	$('#scroll_mov').mousewheel(function(event, delta) {
		if(wheeling == "off") {
			wheeling = "on";
			
			_count = $('.chkNum').val();
			var prePageNum = _count;
		
			if(event.deltaY == -1) {
				if(_count < _length-1) {
					_count++;
				}
			} else {
				if(_count > 0) {
					_count--;
				}
			}
	
			$('.chkNum').val(_count);	
			var nextPageNum = _count;
			
			if(prePageNum != nextPageNum) {
				slide_init(_count);
			}
			
			setTimeout(function() {wheeling = "off"}, 500);
		}
	});
	
	// navigator
	$(".paginate > li").click(function() {
		var _num = $(this).index();
		var targetHeight = $(window).height(); //화면높이
		var _length = $("#scroll_mov #container .cont").length; //컨텐츠 최대개수
		var pageNum = $(this).attr("data-index");

		$.cont = parseInt(pageNum)+1;
		if($("#cont"+$.cont).data("cmode") == "show") {
			setTimeout(function() { $("#header").removeClass("none"); }, 300);	
			if(pageNum != 0) {
				setTimeout(function() { $("#header").removeClass("none"); }, 300);
			} else {
				$("#header").removeClass("none");
			}
		} else {
			setTimeout(function() { $("#header").addClass("none"); }, 300);	
		}

		$(window).resize(function() {
			targetHeight = $(window).height(); //화면높이
			$("#scroll_mov #container .cont, #scroll_mov #container .cont .cont_in").height(targetHeight);
			$("#scroll_mov #container").height(targetHeight*_length);

			var checkNum = $(".chkNum").val();
			$("#scroll_mov #container").stop().animate({top:-(targetHeight*pageNum)}, 500);
		});
		
		// 초기 get파라미터 slide 값이 있을 경우 실행되지 않음.
		if(search_on == "off") {
			var checkNum = $(".chkNum").val();
			$("#scroll_mov #container").stop().animate({top:-(targetHeight*pageNum)}, 500);
		} 
		
		//현재스크롤수 저장
		$(".chkNum").val(pageNum);
		
		// navigator
		$(".paginate > li").eq(pageNum).addClass("on").siblings("li").removeClass("on");


		//slide_init(_num);
	});
	
	move_direct_slide();
});

// 슬라이드 시 설정되는 값
function slide_init(_count) {
	var targetHeight = $(window).height(); //화면높이
	var _length = $("#scroll_mov #container .cont").length; //컨텐츠 최대개수
	
	$(window).resize(function() {
		targetHeight = $(window).height(); //화면높이
		$("#scroll_mov #container .cont, #scroll_mov #container .cont .cont_in").height(targetHeight);
		$("#scroll_mov #container").height(targetHeight*_length);
		var checkNum = $(".chkNum").val();
		$("#scroll_mov #container").stop().animate({top:-(targetHeight*_count)}, 500);
	});
	
	// 초기 get파라미터 slide 값이 있을 경우 실행되지 않음.
	if(search_on == "off") {
		var checkNum = $(".chkNum").val();
		$("#scroll_mov #container").stop().animate({top:-(targetHeight*_count)}, 500);
	} 
	
	//현재스크롤수 저장
	$(".chkNum").val(_count);
	
	// navigator
	$(".paginate > li").eq(_count).addClass("on").siblings("li").removeClass("on");


	$.cont = _count+1;
	if($("#cont"+$.cont).data("cmode") == "show") {
		setTimeout(function() { $("#header").removeClass("none"); }, 300);	
		if(_count != 0) {
			setTimeout(function() { $("#header").removeClass("none"); }, 300);
		} else {
			$("#header").removeClass("none");
		}
	} else {
		setTimeout(function() { $("#header").addClass("none"); }, 300);	
	}

}

// get 파라미터 slide 값으로 바로 이동
function move_direct_slide() {
	var search = location.search; // get 파라미터
	var _count = 0;
	
	if(search) {
		search_on = "on";
		search = search.split('?')[1];

		if(search.indexOf('&') != -1) {
			search = search.split('&')[0];
		}

		var directMove = search.split('='); // 해당 영역으로 슬라이딩되는 값

		if(directMove[0] == 'slide') {
			var _count = (directMove[1]);

			var totalPage = $('.paginate > li').length;
			if(_count > totalPage) {
				_count = totalPage;
			}
			
			_count -= 1;
			var targetHeight = $(window).height();//화면높이
			$("#scroll_mov #container").css("top",-(targetHeight*_count));
		}
	}
	slide_init(_count);
	search_on = "off";
}

//GNB 학원소개 오버시 dep4 노출
$(function() {
	$(".edu_intro > a").mouseenter(function() {
		$(this).parent().addClass('active');
		$(this).parent().parent().parent().parent().animate({width: '197px'}, 250);
	});
	$(".edu_intro").mouseleave(function() {
		$(this).removeClass('active');
		$(this).parent().parent().parent().animate({width: '130px'}, 250);
	});
});