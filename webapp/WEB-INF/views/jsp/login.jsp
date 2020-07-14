<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/cmm/include/taglibs.jsp" %>
<html>
<head>

<script>

$(function(){
	/*
	jQuery(document).ajaxStart(function () {
		ajaxindicatorstart('Processing..');
	}).ajaxStop(function () {
		ajaxindicatorstop();
	});
	*/
	
	//Placeholder
	$(".jshold input").on("focus click", function(){
		$(this).parents("span").addClass("hold")
	});
	$(".jshold input").on("focusout", function(){
		if( $(this).val() == "" ){
			$(this).parents("span").removeClass("hold")
		}else{
			
		}
	});
});


var CtlFunc = {
		
};

var AjaxFunc = {
		login : function(){
			$('form[name=form01]').onAjaxSubmit(options={
				url:$('form[name=form01]').attr('action'),
				dataType:'json',
				success : function(data) {
					if( data.responseCode == '0' ){
						location.href="${pageContext.request.contextPath}/main";
					}
					else{
						alert("아이디와 비밀번호르 다시 확인해 주세요.");
					}

				},
				error : function(request,status,error) {
					alert(error);
					alert('처리중 서버 RuntimeException 오류가 발생하였습니다.\n담당자에게 문의하시기 바랍니다.');
				}
			});
		}
};

var EtcFunc = {

};

</script>

</head>

<body>

	<div id="content" class="content" style="height:100%">
		
        <!-- 이하 콘텐츠 내용 -->
        <div class="login">
			<form name="form01" id="form01" method="post" action="${pageContext.request.contextPath}/ajaxLogin">
			<section>
                    <h2 class="loginTitle"><em class="reds">TRANSCODER</em> <span>로그인</span></h2>
                    <p class="logintxt">아이디와 비밀번호를 입력하시면 로그인하실 수 있습니다.</p>
                    
                    <div class="loginBox">
	                    <div class="loginForm">
	                        <span>
	                            <label for="id" class="hide">아이디</label>
	                            <span class="holder1 jshold"><input type="text" class="inputxt" id="id" name="id" title="아이디 입력" v:required m:required="ID를 입력해주세요" /></span>
	                            <label for="pass" class="hide">패스워드</label>
	                            <span class="holder2 jshold"><input type="password" class="inputxt" id="passwd" name="passwd" title="패스워드 입력" v:required m:required="패스워드를 입력해주세요" /></span>
	                        </span>
	                        <input type="image" onclick="javascript:AjaxFunc.login(); return false;" src="${pageContext.request.contextPath}/images/btn/btn_login.png" alt="LOGIN" class="btnlogin" />
	                    </div>
                    </div>
                    <div class="loginExp">
                    </div>
             </section>
			
			</form>
        </div>
	</div>
</body>
</html>