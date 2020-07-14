<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> 

<!-- Google Code for &#54028;&#44256;&#45796;&#50896;_&#47532;&#47560;&#52992;&#54021; -->
<!-- Remarketing tags may not be associated with personally identifiable information or placed on pages related to sensitive categories. For instructions on adding this tag and more information on the above requirements, read the setup guide: google.com/ads/remarketingsetup -->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 977656873;
var google_conversion_label = "x-zQCKjG_1wQqbiX0gM";
var google_custom_params = window.google_tag_params;
var google_remarketing_only = true;
/* ]]> */
</script>
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/977656873/?value=1.00&amp;currency_code=KRW&amp;label=x-zQCKjG_1wQqbiX0gM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>

<%
String userAgent = request.getHeader("user-agent");
boolean mobile1 = userAgent.matches(".*(iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson).*");
boolean mobile2 = userAgent.matches(".*(LG|SAMSUNG|Samsung).*");
if(mobile1 || mobile2) {
//모바일 접속
	//System.out.println("★★★★★★★★★★★★★ reMarketingScripts.jsp : Mobile 접속 ");
%>
	<!-- 1. 타게팅게이츠 -  MO 리타게팅 스크립트 -->
	<!-- WIDERPLANET  SCRIPT START 2016.1.19 -->
	<div id="wp_tg_cts" style="display:none;"></div>
	<script type="text/javascript">
	var wptg_tagscript_vars = wptg_tagscript_vars || [];
	wptg_tagscript_vars.push(
	(function() {
		return {
			wp_hcuid:"",  	/*Cross device targeting을 원하는 광고주는 로그인한 사용자의 Unique ID (ex. 로그인 ID, 고객넘버 등)를 암호화하여 대입.
					 *주의: 로그인 하지 않은 사용자는 어떠한 값도 대입하지 않습니다.*/
			ti:"20811",	/*광고주 코드*/
			ty:"Home",	/*트래킹태그 타입*/
			device:"mobile"	/*디바이스 종류 (web 또는 mobile)*/
		};
	}));
	</script>
	<script type="text/javascript" async src="//cdn-aitg.widerplanet.com/js/wp_astg_4.0.js"></script>
	<!-- // WIDERPLANET  SCRIPT END 2016.1.19 -->

<%
}else{
//PC 접속
	//System.out.println("★★★★★★★★★★★★★ reMarketingScripts.jsp : PC 접속 ");
%>
	<!--  1. 타게팅게이츠 PC - 리타겟팅 스크립트  -->
	<!-- WIDERPLANET  SCRIPT START 2016.1.19 -->
	<div id="wp_tg_cts" style="display:none;"></div>
	<script type="text/javascript">
	var wptg_tagscript_vars = wptg_tagscript_vars || [];
	wptg_tagscript_vars.push(
	(function() {
		return {
			wp_hcuid:"",   /*Cross device targeting을 원하는 광고주는 로그인한 사용자의 Unique ID (ex. 로그인 ID, 고객넘버 등)를 암호화하여 대입.
					*주의: 로그인 하지 않은 사용자는 어떠한 값도 대입하지 않습니다.*/
			ti:"20811",	/*광고주 코드*/
			ty:"Home",	/*트래킹태그 타입*/
			device:"web"	/*디바이스 종류 (web 또는 mobile)*/
			
		};
	}));
	</script>
	<script type="text/javascript" async src="//cdn-aitg.widerplanet.com/js/wp_astg_4.0.js"></script>
	<!-- // WIDERPLANET  SCRIPT END 2016.1.19 -->
	
<%}%>

<!-- Naver 공통 적용 스크립트 , 모든 페이지에 노출되도록 설치. 단 전환페이지 설정값보다 항상 하단에 위치해야함 START 2016.01.21 by chanwj --> 
<script type="text/javascript" src="http://wcs.naver.net/wcslog.js"> </script> 
<script type="text/javascript"> 
	if (!wcs_add) var wcs_add={};
	wcs_add["wa"] = "s_51135434e192";
	if (!_nasa) var _nasa={};
	wcs.inflow("pagodaone.com"); 
	wcs_do(_nasa);
</script>
<!-- Naver 공통 적용 스크립트 , 모든 페이지에 노출되도록 설치. 단 전환페이지 설정값보다 항상 하단에 위치해야함 END 2016.01.21 by chanwj --> 


<!-- Facebook Pixel Code 2016.02.22 by chanwj -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','//connect.facebook.net/en_US/fbevents.js');

fbq('init', '193323217695636');
fbq('track', "PageView");</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=193323217695636&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code 2016.02.22 by chanwj -->


<!-- N2S 스크립트 광고  수집용 Start -->
<script type="text/javascript" src="//web.n2s.co.kr/js/_n2s_sp_log_pagodaone.js"></script>
<!-- N2S 스크립트 광고  수집용 End -->
