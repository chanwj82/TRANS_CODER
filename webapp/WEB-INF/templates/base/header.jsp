<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/cmm/include/taglibs.jsp" %>
<div class="titleArea">
	<div style="text-align: right;padding-right: 20px; font-size: 10px;padding-top: 4px;">
		<c:choose>
			<c:when test="${not empty sessionScope.PAGODA_SESSION.name }">
				${sessionScope.PAGODA_SESSION.name } 님 반갑습니다. | <a href="/logout" style="cursor:hand;">로그아웃</a>
			</c:when>
			<c:otherwise>
				
			</c:otherwise>
		</c:choose>
		
		
	</div>
	<div><h2 class="info_tit">트랜스코딩</h2></div> 
</div>
