<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/cmm/include/taglibs.jsp" %>
<script type="text/javascript">
$(document).ready(function(){
	if("<spring:eval expression="@properties['message.type.default']" />" == "dialog"){		
		if($("#_alertFrm").length == 0){
			var form = $('<form></form>').attr("id",'_alertFrm' ).attr("name", '_alertFrm').attr("method", 'POST'); 
	        $('body').append(form);
         }
		
		$("#_alertFrm").messageLayer(options={title:"<spring:message code="경고"/>", message:"${resultMessage}"});
	    $("#_alertFrm").messageLayer(options={title:"<spring:message code="경고"/>", message:"<mc:customBindErrors delimiter="<br/>" />"});	    
	}else{
		if("${resultMessage}" != ""){
		    alert("${resultMessage}");
		}
		if("<mc:customBindErrors />" != ""){
			alert("<mc:customBindErrors delimiter="\\n" />");
		}
	}
	
	/*
	console.log = function(message) {
		if($("#debugDiv").length == 0){
            var debugDiv = $('<div></div>').attr("id",'debugDiv' )
            .attr('style','height: 200px; width: 300px; border: 1px solid #333; overflow:scroll; position: absolute; top: 150px; left: 10px; display: block; z-index: 101;'); 
            $('body').append(debugDiv);
        }
		$('#debugDiv').append('<p>' + message + '</p>');
	};
	console.error = console.debug = console.info =  console.log
    */
    
});
</script>