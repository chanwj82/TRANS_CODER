<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/cmm/include/taglibs.jsp" %>
<html>
<head>

<script>
var ws = null;
var url = "ws://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/websocket";

$(function(){
	/*
	jQuery(document).ajaxStart(function () {
		ajaxindicatorstart('Processing..');
	}).ajaxStop(function () {
		ajaxindicatorstop();
	});
	*/

	connect();
});


function connect() {
    <!-- 중요 포인트!! url을 이용해서 WebSocket을 생성하고 각각 이벤트에 대한 처리를 정의한다.-->

    ws = new WebSocket(url);

    ws.onopen = function () {
        // 서버에 접속한 후 이벤트 정의
    };
    ws.onmessage = function (event) {
        // 서버에서 Session.send를 이용해서 메시지 전송할 때 수신 이벤트 정의
        var obj = eval("("+event.data+")");
        
        if(obj.eventId == "connect" ){
        	$("#clientSessionId").val(obj.clientSessionId);
        }
        if(obj.eventId == "add" ){
        	var htmlTr = "<tr>"
				+	"<td><div>"+obj.filename+"</div></td>"
				+	"<td><div><svg style='align:left;' id='progressbar_"+ obj.fileid + "'></svg></div></td>"
				+	"<td><div id='video_"+ obj.fileid + "'></div></td>"
				+ "</tr>";
			$('#list > tbody:last-child').append(htmlTr);
			eval("progress_" + obj.fileid + " = $('#progressbar_" + obj.fileid + "').Progress({percent: 0,width: 150,height: 20,barColor:'#5E9DE6',fontSize: 16,animate: false});");
        }
        if(obj.eventId == "sendAll" ){
        	eval("progress_"+obj.fileid+".percent("+ obj.progress + ")");
        }
        if(obj.eventId == "completeAll" ){
        	eval("progress_"+obj.fileid+".percent(100)");
        	var html = "<a class='btn8' onclick=\"javascript:play('"+obj.url+"');\"><span>PLAY</span></a>";
        	$("#video_" + obj.fileid).html(html);

        }
    };
}

function disconnect() {
    ws.close();
    ws = null;
}

function echo() {
    // send 명령을 이용해서 전송을 한다.
    var message = "hello socket server!!";
    ws.send(message);
}

function play(src){
	$("#PLAYER").attr("src",src);
}


</script>

</head>

<body>

<div id="content" class="content">
	<div class="tableStyle6">
       
		
		<table class="jsCell" id="list">

			<caption>트랜스코딩 목록</caption>
			<colgroup>
				<col style="width:150px" />
				<col/>
				<col style="width:150px"/>
			</colgroup>
			<thead>
				<tr>
					<th><div>파일명</div></th>
					<th><div>진행율</div></th>
					<th><div>PLAY</div></th>
				</tr>
			</thead>
			<tbody>
				<c:if test="${!empty currentJob }">
					<tr>
						<td><div>${currentJob.filename }</div></td>
						<td><div><svg style="align:left;" id="progressbar_${currentJob.fileid }"></svg></div></td>
						<td><div id="video_${currentJob.fileid }"></div>
							<script>
							var progress_${currentJob.fileid } = $("#progressbar_${currentJob.fileid }").Progress({
						        percent: 0,
						        width: 150,
						        height: 20,
								barColor:'#5E9DE6',
						        fontSize: 16,
						        animate: false
						      });
						
						</script>
						</td>
					</tr>
				</c:if>
				
				<c:if test="${!empty queueJoblist }">
					<c:forEach var="list" items="${queueJoblist }">
						<tr>
							<td><div>${list.filename}</div></td>
							<td><div><svg style="align:left;" id="progressbar_${list.fileid}"></svg></div></td>
							<td><div id="video_${list.fileid}"></div>
								<script>
									var progress_${list.fileid} = $("#progressbar_${list.fileid}").Progress({
								        percent: 0,
								        width: 150,
								        height: 20,
										barColor:'#5E9DE6',
								        fontSize: 16,
								        animate: false
								      });
								
								</script>
							</td>
						</tr>
					
					</c:forEach>
				
				</c:if>
				
				
			</tbody>
		</table>
		<br><br>
		<div class="alignCenter">
			<video id="PLAYER" src="http://192.168.11.168/encode/20160630145013_593a6f7e2ff7419bad4c7baf4f68d117.mp4" controls style="border:1px solid #ccc; width:100%;" autoplay="autoplay">이 브라우저는 재생할 수 없습니다.</video>
		</div>
	</div>		
</div>
</body>
</html>