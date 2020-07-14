(function($) {
	$.fn.onAjaxSubmit = function(options) {
		try {
			
			if($(".dims").length == 0){
				var dims = document.createElement("div")
			    dims.className = "dims"
			    $(dims).appendTo("body")
			}
		    $(".dims").show();
		    		    
			// msgType default 정의.
			var msgType = "alert";				
			if (options.validmessage != undefined) {
				$(".dims").hide();
				msgType = options.validmessage; 
			}
			
			// 폼의 validation 체크.
			if (options.validation != undefined && options.validation) {			
				var	vrs	= validate($(this).attr("name"), null);
				if (vrs.length>0) {
					var messages="";
					for (var i=0; i<vrs.length; i++) {
						if(i>0){
							messages+="<br/>";
						}
						messages+=vrs[i].text;
						
						if(msgType == "alert"){
							$(".dims").hide();
							alert(messages);
							return false;
						}
					}
					$(".dims").hide();
					$(this).messageLayer(options={title:"알림", message:messages});					
					return false;
				}
			}

			//form method 설정.
			if (options.method != undefined && options.method != null) {
				$(this).attr({ method : options.method });
			}
			
			//submit target 설정.
			if (options.target != undefined && options.target != null) {
				$(this).attr({ target : options.target });
			} else {
				$(this).attr({ target : "_self"	});
			}
			
			//submit action 설정.
			if (options.url != undefined && options.url != null) {
				$(this).attr({ action : options.url });
			}else{
				$(".dims").hide();
				return false;
			}
			
			if (options.callpost != null) {
				var result = options.callpost();
				if (result == false){
					$(".dims").hide();
					return result;
				}	
			}
				
			//multipart/form-data 일 경우 iframe submit 으로 대체 함.
			if ($(this).attr("enctype") == 'multipart/form-data') {
				var iframeId = 'iframe' + (new Date().getTime());
				$(this).attr("target", iframeId);
				
				$iframe = $("<iframe>", {
		            src  : "about:blank", 
		            name : iframeId,
		            style: "display:none;"
		        });
				$iframe.appendTo('body');
				
				$iframe.on("load", function (e) {
					var data;
					if($iframe.contents().find("body").length>0){
						try{
							data = $.parseJSON($iframe.contents().find("body").text());
						}catch(e){
							data = $iframe.contents().find("body").text();
						}
					}else{
						data = $iframe.contents().text();
					}
					
		        	options.success(data);
		        	
		        	$(".dims").hide();
		        	
					$(this).remove();
		        });
				
				$(".dims").hide();
				$(this).submit();
				$(this).removeAttr("target");
				
			} else {//ajax submit  실행.
				var async = true;
				if (options.async != undefined) {
					async = options.async;
				}
				$(this).ajaxForm({
			        async : async,
			        cache : false,
			        dataType : "json",
			        iframe : false,
			        success : function(data, textStatus) {
			        	if(data != null && data.status != undefined){
			        		if(data.status == "INVALIDATE"){
			        			var messages="";
			        			for(var i =0; i< data.result.length; i++){
			        				if(i>0){
										messages+="<br/>";
									}
									messages+=data.result[i].defaultMessage;
			        			}
			        			$(".dims").hide();
			        			$('body').messageLayer(options={title:"알림", message:messages});
								return false;
			        		}else{
			        			$(".dims").hide();
			        			options.success(data);	
			        		}
			        	}else{
			        		$(".dims").hide();
			        		options.success(data);
			        	}
			        	$(".dims").hide();
			        },
			        uploadProgress: function(event, position, total, percentComplete) {
			            options.uploadProgress(event, position, total, percentComplete);
			        },
			        error : function(jqXHR, textStatus, errorThrown) {
			        	$(".dims").hide();
			        	if(jqXHR.status == "401" || jqXHR.status == "403" ){
			        		location.href="/";
			        	}
			        	options.error(jqXHR, textStatus, errorThrown);
			        }
			    }).submit();
				$(this).ajaxFormUnbind();
			}
		} catch (e){
			$(".dims").hide();
			return false;
		}
		return true;
		
	};
	
	$.fn.onSubmit = function(options) {
		try {
			
			if($(".dims").length == 0){
				var dims = document.createElement("div")
			    dims.className = "dims"
			    $(dims).appendTo("body")
			}
		    $(".dims").show();
		    
			$(this).ajaxFormUnbind();
			
			// msgType default 정의.
			var msgType = "alert";				
			if (options.validmessage != undefined) {
				msgType = options.validmessage; 
			}
			
			// 폼의 validation 체크.
			if (options.validation != undefined && options.validation) {
				var	vrs	= validate($(this).attr("name"), null);
				if (vrs.length>0) {
					var messages="";
					for (var i=0; i<vrs.length; i++) {
						if(i>0){
							messages+="<br/>";
						}
						messages+=vrs[i].text;
						
						if(msgType == "alert"){
							$(".dims").hide();
							alert(messages);
							return false;
						}
					}
					$(".dims").hide();
					$(this).messageLayer(options={title:"알림", message:messages});
					return false;
				}
			}
			
			//form method 설정.
			if (options.method != undefined && options.method != null) {
				$(this).attr({ method : options.method });
			}
			
			//submit target 설정.
			if (options.target != undefined && options.target != null) {
				$(this).attr({ target : options.target });
			} else {
				$(this).attr({ target : "_self"	});
			}
			
			//submit action 설정.
			if (options.url != undefined && options.url != null) {
				$(this).attr({ action : options.url });
			}else{
				$(".dims").hide();
				return false;
			}
			
			if (options.callpost != null) {
				var result = options.callpost();
				if (result == false){
					$(".dims").hide();
					return result;
				}	
			}
			
			$(this).submit();
			$(".dims").hide();
			
		} catch (e){
			$(".dims").hide();
			return false;
		}
		return true;
	};	
})(jQuery);