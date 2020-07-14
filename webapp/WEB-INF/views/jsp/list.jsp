<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/cmm/include/taglibs.jsp" %>
<html>
<head>

<script>
var ws = null;
var url = "ws://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/websocket";
var progressBar = {}; 

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
    	//progress.percent(event.data);
        var obj = eval("("+event.data+")");
        
        if(obj.eventId == "connect" ){
        	$("#clientSessionId").val(obj.clientSessionId);
        }
        if(obj.eventId == "add" ){
        	//location.reload();
        	var htmlTr = "<tr>"
        				+	"<td><div>"+obj.filename+"</div></td>"
        				+	"<td><div><svg style='align:left;' id='progressbar_"+ obj.fileid + "'></svg></div></td>"
        				+	"<td><div id='video_"+ obj.fileid + "'></div></td>"
        				+ "</tr>";
        	
        	$('#list > tbody:last-child').append(htmlTr);
        	eval("progress_" + obj.fileid + " = $('#progressbar_" + obj.fileid + "').Progress({percent: 0,width: 150,height: 20,barColor:'#5E9DE6',fontSize: 16,animate: false});");
        	
        }
        if(obj.eventId == "sendAll" ){
        	//alert("progress_"+obj.fileid+".percent("+ obj.progress + ")");
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
	parent.play(src);
}


</script>

</head>

<body>

<div id="content" class="content">
	<div class="tableStyle6" style="height:100%">

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
					<th><div>트랜스코딩 진행율</div></th>
					<th><div>PLAY</div></th>
				</tr>
			</thead>
			<tbody>
				
				
			</tbody>
		</table>
	</div>		
</div>
</body>
</html>