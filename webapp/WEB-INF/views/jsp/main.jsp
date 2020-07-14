<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/cmm/include/taglibs.jsp" %>
<html>
<head>
<script>
var ws = null;
var url = "ws://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/websocket";
var isStart = false;
var progress;
$(function(){
	/*
	jQuery(document).ajaxStart(function () {
		ajaxindicatorstart('Processing..');
	}).ajaxStop(function () {
		ajaxindicatorstop();
	});
	*/
	progress = $("#progressbar").Progress({
        percent: 0,
        width: 400,
        height: 20,
		barColor:'#5E9DE6',
        fontSize: 16,
        animate: false
      });
	
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
        	///alert("connected");
        	$("#clientSessionId").val(obj.clientSessionId);
        	//startUpload();
        }
        if(obj.eventId == "send" ){
        	progress.percent(50 + Math.round(obj.message/2));
        }
        if(obj.eventId == "complete" ){
        	progress.percent(100);
			//alert(obj.message);
			//$("#PLAYER").attr("src",obj.message);
			play(obj.message)
        }
        /*
        if(obj.eventId == "sendAll" ){
        	progress.percent(50 + Math.round(obj.progress/2));
        	
        	if( !isStart ){
        		$('#IFRAME').attr("src", $('#IFRAME').attr("src"));
        		isStart = true;
        	}
        	 
        }
        if(obj.eventId == "completeAll" ){
        	progress.percent(100);
			//alert(obj.message);
			$("#PLAYER").attr("src",obj.url);

			disconnect();
        }
        */
    };
}

function disconnect() {
    ws.close();
    ws = null;
    
    isStart = false;
}

function echo() {
    // send 명령을 이용해서 전송을 한다.
    var message = "hello socket server!!";
    ws.send(message);
}

function transcodingStart(){
	if($("#SOURCE_FILE1").val() == ""){
		alert("파일을 선택해 주세요.");
		return;
	}
	
	if( $("#SOURCE_FILE1").val() != "" ){
		var ext = $('#SOURCE_FILE1').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['mp4','mp3','wmv','avi','mgeg','mkv']) == -1) {
			alert('파일은 mp4, mp3, wmv, avi, mgeg  파일만 업로드 할수 있습니다.');
			$("##SOURCE_FILE1").focus();
			return;
		}
	}
	
	//connect();
	startUpload();
}

function startUpload(){
	$('form[name=form01]').onAjaxSubmit(options={
		url:$('form[name=form01]').attr('action'),
		dataType:'json',
		success : function(data) {
			if( data.responseCode == '0' ){
				//progress.percent(100);
				//$("#PLAYER").attr("src",data.responseUrl);
			}
			else{
				alert("처리중 오류가 발생하였습니다.\n" + data.responseMessage);
			}
			
			//disconnect();
		},
		uploadProgress: function(event, position, total, percentComplete) {
            //alert("uploadProgress percentComplete : " + percentComplete);
            progress.percent(percentComplete);
        },
		error : function(request,status,error) {
			alert('처리중 서버 RuntimeException 오류가 발생하였습니다.\n담당자에게 문의하시기 바랍니다.');
			disconnect();
		}
	});
}

function play(src){
	$("#PLAYER").attr("src",src);
}

</script>

</head>

<body>

	<div id="content" class="content" style="height:100%">

        <div style="width:100%; height:100%;">
        	<div style="width:48%; float:left; padding-left:10px; margin-top:-15px;">
        		<iframe name="actionFrame" width="0" height="0" frameborder="0"></iframe>
				<form name="form01" id="form01" method="post" enctype="multipart/form-data; application/json" action="${pageContext.request.contextPath}/ajaxTranscoderStart5" target="actionFrame">
				<input type="hidden" name="clientSessionId" id="clientSessionId" />
				
				<div class="tbl_review2">
				
					<table>
						<col width="160"><col width="150"><col width="150"><col width="*">
						<tbody>

							<tr>
								<th>코덱</th>
								<td>
									<select name="videoCodec" id="videoCodec" class="selectbox">
										<option value="asv1">asv1</option>
										<option value="ffv1">ffv1</option>
										<option value="h261">h261</option>
										<option value="libtheora">libtheora</option>
										<option value="mpeg1video">mpeg1video</option>
										<option value="msmpeg4v2">msmpeg4v2</option>
										<option value="png">png</option>
										<option value="rv10">rv10</option>
										<option value="targa">targa</option>
										<option value="zmbv">zmbv</option>
										<option value="asv2">asv2</option>
										<option value="ffvhuff">ffvhuff</option>
										<option value="h263">h263</option>
										<option value="libx264">libx264</option>
										<option value="h264" selected>h264(모바일)</option>
										<option value="mpeg2video">mpeg2video</option>
										<option value="pam">pam</option>
										<option value="ppm">ppm</option>
										<option value="rv20">rv20</option>
										<option value="tiff">tiff</option>
										<option value="bmp">bmp</option>
										<option value="flashsv">flashsv</option>
										<option value="h263p">h263p</option>
										<option value="libxvid">libxvid</option>
										<option value="mpeg4">mpeg4</option>
										<option value="pbm">pbm</option>
										<option value="qtrle">qtrle</option>
										<option value="sgi">sgi</option>
										<option value="wmv1">wmv1</option>
										<option value="dnxhd">dnxhd</option>
										<option value="flv">flv</option>
										<option value="huffyuv">huffyuv</option>
										<option value="ljpeg">ljpeg</option>
										<option value="msmpeg4">msmpeg4</option>
										<option value="pgm">pgm</option>
										<option value="rawvideo">rawvideo</option>
										<option value="snow">snow</option>
										<option value="wmv2">wmv2</option>
										<option value="dvvideo">dvvideo</option>
										<option value="gif">gif</option>
										<option value="jpegls">jpegls</option>
										<option value="mjpeg">mjpeg</option>
										<option value="msmpeg4v1">msmpeg4v1</option>
										<option value="pgmyuv">pgmyuv</option>
										<option value="roqvideo">roqvideo</option>
										<option value="svq1">svq1</option>
										<option value="zlib">zlib</option>
									</select>
								</td>
								<th>VIDEO 비트레이트</th>
								<td>
									<select name="videoBitRate" id="videoBitRate" class="selectbox">
										<option value="" selected>원본유지</option>
										<option value="16k">16k</option>
										<option value="128k">128k</option>
										<option value="425k">425k</option>
										<option value="1100k">1100k(모바일)</option>
										<option value="9200k">9200k</option>
										<option value="19000k">19000k</option>
										<option value="50000k">50000k</option>
									</select>
								</td>
							</tr>
							<tr>
								<th>AUDIO 코덱</th>
								<td>
									<select name="audioCodec" id="audioCodec" class="selectbox">
										<option value="ac3">ac3</option>
										<option value="adpcm_yamaha">adpcm_yamaha</option>
										<option value="libfaac">libfaac</option>
										<option value="libfdk_aac">libfdk_aac</option>
										<option value="libvo_aacenc">libvo_aacenc</option>
										<option value="mp2">mp2</option>mp4a 
										<option value="aac" selected>aac(모바일)</option>
										<option value="pcm_s24be">pcm_s24be</option>
										<option value="pcm_s8">pcm_s8</option>
										<option value="pcm_u32be">pcm_u32be</option>
										<option value="sonic">sonic</option>
										<option value="adpcm_adx">adpcm_adx</option>
										<option value="flac">flac</option>
										<option value="libgsm">libgsm</option>
										<option value="pcm_alaw">pcm_alaw</option>
										<option value="pcm_s24daud">pcm_s24daud</option>
										<option value="pcm_u16be">pcm_u16be</option>
										<option value="pcm_u32le">pcm_u32le</option>
										<option value="sonicls">sonicls</option>
										<option value="adpcm_ima_wav">adpcm_ima_wav</option>
										<option value="g726">g726</option>
										<option value="libgsm_ms">libgsm_ms</option>
										<option value="pcm_mulaw">pcm_mulaw</option>
										<option value="pcm_s24le">pcm_s24le</option>
										<option value="pcm_u16le">pcm_u16le</option>
										<option value="pcm_u8">pcm_u8</option>
										<option value="vorbis">vorbis</option>
										<option value="adpcm_ms">adpcm_ms</option>
										<option value="libamr_nb">libamr_nb</option>
										<option value="libmp3lame">libmp3lame</option>
										<option value="pcm_s16be">pcm_s16be</option>
										<option value="pcm_s32be">pcm_s32be</option>
										<option value="pcm_u24be">pcm_u24be</option>
										<option value="pcm_zork">pcm_zork</option>
										<option value="wmav1">wmav1</option>
										<option value="adpcm_swf">adpcm_swf</option>
										<option value="libamr_wb">libamr_wb</option>
										<option value="libvorbis">libvorbis</option>
										<option value="pcm_s16le">pcm_s16le</option>
										<option value="pcm_s32le">pcm_s32le</option>
										<option value="pcm_u24le">pcm_u24le</option>
										<option value="roq_dpcm">roq_dpcm</option>
										<option value="wmav2">wmav2</option>
									</select>
								</td>
								<th>AUDIO 비트레이트</th>
								<td>
									<select name="audioBitRate" id="audioBitRate" class="selectbox">
										<option value="" selected>원본유지</option>
										<option value="32k">32k</option>
										<option value="64k">64k</option>
										<option value="96k">96k</option>
										<option value="128k">128k(모바일)</option>
										<option value="192k">192k</option>
										<option value="320k" >320k</option>
										<option value="640k">640k</option>
										<option value="1536k">1536k</option>
										<option value="6000k">6000k</option>
										<option value="18000k">18000k</option>
										<option value="24500k">24500k</option>
									</select>
								</td>
							</tr>
							<tr>
								<th>해상도선택</th>
								<td colspan=3>
									<select name="resolution" id="resolution" class="selectbox">
										<option value="" selected>원본유지</option>
										<option value="400:300">400x300</option>
										<option value="640:360">640x360(모바일)</option>
										<option value="640:480">640x480</option>
										<option value="960:640">960x640</option>
										<option value="1280:720">1280x720</option>
										<option value="1920:1080">1920x1080</option>
										<option value="2560:1440">2560x1440</option>
									</select>
								</td>
							</tr>
							<!-- 
							<tr>
								<td>AUDIO 비트레이트</td>
								<td>
									<select name="bitRateType" id="bitRateType">
										<option value="CBR">CBR ( Constant Bit Rate )</option>
										<option value="VBR">VBR ( Variable Bit Rate )</option>
									</select>
								</td>
							</tr>
							 -->
							<tr>
								<th>동영상 파일</th>
								<td width="*" colspan=3 style="text-align:left">
									<input type="file" name="SOURCE_FILE1" id="SOURCE_FILE1" width="300" style="width:300px; border:1px solid #bbb;" class="input_form1">
								</td>
							</tr>
							<tr>
								<th>동영상 파일</th>
								<td width="*" colspan=3 style="text-align:left">
									<input type="file" name="SOURCE_FILE2" id="SOURCE_FILE2" width="300" style="width:300px; border:1px solid #bbb;" class="input_form1">
								</td>
							</tr>
							<tr>
								<th>동영상 파일</th>
								<td width="*" colspan=3 style="text-align:left">
									<input type="file" name="SOURCE_FILE3" id="SOURCE_FILE3" width="300" style="width:300px; border:1px solid #bbb;" class="input_form1">
								</td>
							</tr>
							<tr>
								<th>
									업로드 진행율
								</th>
								<td colspan=3 style="text-align:left"><svg style="align:left;" id="progressbar"></svg></td>
							</tr>
						</tbody>
					</table>
					
				</div>
				</form>
				<br>
				<div class="suggest">
					<div class="alignCenter">
						<a class="btn8" onclick="javascript:transcodingStart();"><span>UPLOAD</span></a>
					</div>
					<br>
					<div class="alignCenter">
						<video id="PLAYER" src="" controls style="border:1px solid #ccc;" autoplay="autoplay">이 브라우저는 재생할 수 없습니다.</video>
					</div>
				</div>
				
        	</div>
        	<div style="width:48%; height:100%; float:right;">
        		<iframe id="IFRAME" src="${pageContext.request.contextPath}/list" style="width:98%; height:90vh;"></iframe>
        	</div>
        </div>

	</div>
</body>
</html>