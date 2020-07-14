// 서브왼쪽메뉴
$(document).ready(function() {
/*
	$("#secondpane a.menu_head_on").click(function() {
		
		$(this)
		.next("div.menu_body")
		.slideDown(300)
		.siblings("div.menu_body")
		.slideUp(300)

		;

		

	});
	$("div.sub_menu").mouseleave(function() {

		$("#secondpane a.menu_head_on").siblings("div.menu_body").not(".mmmon").slideUp(300);
		$("#secondpane a.subon2").next("div.menu_body").slideDown(300);
		//$("#secondpane a.menu_head_on").siblings("div.menu_body").find(".mmmon").show();
	});
	
	$("#secondpane a.subon").next("div.menu_body").slideDown(300);
*/
	
	/* LNB */
	
	$("div.left_edge").mouseleave(function() {

		$("#secondpane a.menu_head_on").siblings("div.menu_body").not(".mmmon").slideUp(200);
		$("#secondpane a.now").next("div.menu_body").slideDown(300);
		
		$('.menu_list li a.subon2').removeClass("subon2");
		$('.menu_list li a.subon').removeClass("subon");
		
		if($('.menu_list li a.now').hasClass("menu_head_on")){
			$('.menu_list li a.now').addClass("subon2");
		}else{
			$('.menu_list li a.now').addClass("subon");
		}
		
		
	});
	$("#secondpane a.menu_head_on").click(function(){
		
		$(this).parent().parent().find("li a.subon2").removeClass("subon2");
		$(this).parent().parent().find("li a.subon").removeClass("subon");
		
		$(this).parent().siblings("li").find(".depth2").slideUp(200);
		
		$(this).addClass("subon2").siblings("li").find(".depth2").slideUp(200);
		if($(this).next().hasClass("depth2") == true){
			$(this).next().slideToggle(200);
		}
	});
	

});

function menuOver(class_cd){
	$('#secondpane').find(".on").removeClass("on");
	$("."+class_cd).parent().addClass("on");
	
	//alert(1);
}
function mainMenuOut(){
	$('.menu_edge').find(".on").removeClass("on");
}
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
function personalityPopup() {

	var title  = "personalityPopup";
	var status = "toolbar=no,directories=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=625, height=800, top=0,left=20";
	window.open("/en/personalityTest.jsp" , title,status);
	
}
//flashWrite(파일경로, 가로, 세로[, 변수][,배경색][,윈도우모드])

function flashIndexWrite(url,w,h,vars,bg,win){

	var id=url.split("/")[url.split("/").length-1].split(".")[0]; //id는 파일명으로 설정
	if(vars==null) vars='';
	if(bg==null) bg='#FFFFFF';
	if(win==null) win='transparent';

	// 플래시 코드 정의

	var flashStr= "	<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'";
		flashStr+="			codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0'";
		flashStr+="			width='"+w+"'";
		flashStr+="			height='"+h+"'";
		flashStr+="			id='"+id+"'";
		flashStr+="			align='middle'>";

		flashStr+="		<param name='allowScriptAccess' value='always' />";
		flashStr+="		<param name='movie' value='"+url+"' />";
		flashStr+="		<param name='FlashVars' value='"+vars+"' />";
		flashStr+="		<param name='wmode' value='"+win+"' />";
		flashStr+="		<param name='menu' value='false' />";
		flashStr+="		<param name='quality' value='high' />";
		flashStr+="		<param name='bgcolor' value='"+bg+"' />";


		flashStr+="		<embed src='"+url+"'";
		flashStr+="		       flashVars='"+vars+"'";
		flashStr+="		       wmode='"+win+"'";
		flashStr+="		       menu='false'";
		flashStr+="		       quality='high'";
		flashStr+="		       bgcolor='"+bg+"'";
		flashStr+="		       width='"+w+"'";
		flashStr+="		       height='"+h+"'";
		flashStr+="		       name='"+id+"'";
		flashStr+="		       align='middle'";
		flashStr+="		       allowScriptAccess='always'";
		flashStr+="		       type='application/x-shockwave-flash'";
		flashStr+="		       pluginspage='http://www.macromedia.com/go/getflashplayer' />";
		flashStr+=" </object>";


	// 플래시 코드 출력

	document.write(flashStr);

}
var  foto1= new Image();
function CaricaFoto(img){	 
	  foto1.src=(img);
	  Controlla(img);
}

function Controlla(img){
  if((foto1.width!=0)&&(foto1.height!=0)){
	  viewFoto(img);
  }
  else{
    funzione="Controlla('"+img+"')";
    intervallo=setTimeout(funzione,20);
  }
}

function viewFoto(img){
  var largh=foto1.width+20;
  var altez=foto1.height+20;
  var stringa="width="+largh+",height="+altez;
  var finestra = window.open(img,"",stringa);
  finestra.focus();
}
