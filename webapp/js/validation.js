/**
 * 벨리데이션 검사 펑션들은 다음과 같은 형식으로 기술합니다.
 * 
 * {
 *     펑션명 : function(검사대상, 추가옵션(배열)) {
 *                      유효성 검사
 *                          .
 *                          .
 *                          .
 *                  return {유효하면 true, 아니면 false};
 *                  false 이면 메세지를 출력하고 벨리데이션 결과를 false로 반환합니다.
 *              }
 * @author pat(patracyu@hanmail.net)
 */

/**
 * 벨리데이트 평션들이 등록되는 객체입니다.
 */
var	_validateFncs	= {};

/**
 * 폼 요소의 유효성을 검사합니다.
 * @param target 대상 폼객체나 폼이름 혹은 폼 요소
 * @param exfns 추가 검사 펑션들
 * @return 유효하지 않은 결과 배열, 각 배열 원소는 {obj, text, link}의 타입입니다.	
 *         obj는 유효하지 않은 입력이 설정된 객체, text는 오류메세지, link는 링크걸린 오류 메세지 입니다.
 *         크기가 0이면 모두 유효함을 의미합니다.
 */  
function validate(target, exfns) {
	alert('validate');
	var	rv;
	var	tfm;
	var	tfmName;
	var	tobj;
	var	vfncs;
	var	msgSet;
	
	if (target === undefined || target == null) {
		return null;
	}
	if (typeof(target) == "string") {
		tfmName	= target;
	} else if (typeof(target) == "form") {
		tfmName	= target.name;
	} else {
		tfmName	= target.form.name;
		tobj	= target;
	}
	tfm		= $("form[name=" + $.escapeExpr(tfmName) + "]");
	vfncs	= $.extend({}, _validateFncs, exfns);
	rv		= new Array();
	msgSet	= new Array();
	if (tobj != null) {
		_validateWorkerfunction(0, tobj, tfm, tfmName, vfncs, msgSet, rv);
	} else {
		$(":input", tfm).each(function (idx, tobj) {_validateWorkerfunction(idx, tobj, tfm, tfmName, vfncs, msgSet, rv);});
	}
	return rv;
}

function _validateWorkerfunction(idx, tobj, tfm, tfmName, vfncs, msgSet, result) {
	for (var i=0; i<tobj.attributes.length; i++) {
		var	attr;
		var	sp;
		var	macher;
		var fncExpr;
		var	fncName;
		var	fncIdx;
		var	fnc;
		var	fncArg;
		var	msg;
		
		if (tobj.disabled) {
			return;
		}
		attr	= tobj.attributes.item(i);
		sp		= attr.nodeName.indexOf("v:");
		if (sp != 0) {
			continue;
		}
		fncExpr	= attr.nodeName.substring(2);
		macher	= /(.+?)([0-9]*)$/.exec(fncExpr);
		fncName	= macher[1];
		fncIdx	= macher.length == 2 ? "" : macher[2];
		fnc		= eval("vfncs." + fncName);
		if (fnc === undefined || fnc == null) {
			result[result.length]	= {  obj  : tobj
	                   , text : "Unsupport function : " + fncName
	                   , link : "Unsupport function : " + fncName};
			continue;
		}
		fncArg		= new Array();
		if (attr.value != null) {
			var	sg;
			
			sg	= "";
			for (var j=0; j<attr.value.length; j++) {
				var	cp;
				
				cp	= attr.value.charAt(j);
				switch (cp) {
					case '\\' :
							if (j < attr.value.length) {
								sg	+= attr.value.charAt(j);
							}
						break;
					case ',' :
						fncArg[fncArg.length] = _validateExpress(sg, tfm);
						sg	= "";
						break;
					default	:
						sg	+= cp;
						break;
				}
			}
			fncArg[fncArg.length]= _validateExpress(sg, tfm);
		}
		msg	= null;
		try {
			if (!fnc(tobj, fncArg, attr.value)) {
				msg	= $(tobj).attr('m:' + fncExpr);
				if (msg === undefined || msg == null) {
					msg	= $(tobj).attr('m:default');
				}
				if (msg === undefined || msg == null) {
					msg	= tobj.name + " is invalidate.";
				}
				
				// 하드코딩 제거 대상
				if (fncName == 'text8_limit') {
					msg += " (Inputed " + $.getByteLength($(tobj).val(), 3) + "Bytes)";
				} else if (fncName == 'text16_limit') {
					msg += " (Inputed " + $.getByteLength($(tobj).val(), 2) + "Bytes)";
				}
			}
		} catch(e) {
			msg	= "Validate function error : " + e.message + " in function " + fncName;
		}
		if (msg != null) {
			for (var j=0; j<msgSet.length; j++) {
				if (msgSet[j] == msg && result[j].obj == tobj) {
					msg	= null;
					break;
				}
			}
			if (msg != null) {
				msgSet[msgSet.length]	= msg;
				result[result.length]	= {  obj  : tobj
						                   , text : msg
						                   , link : "_goInvalidatefield(&quot;" + tfmName + "&quot;, &quot;" + tobj.name +  "&quot;);"};
			}
		}
	}
}

function _goInvalidatefield(formName, fieldName) {
	$("form[name=" + $.escapeExpr(formName) + "] :input:enabled[name=" + $.escapeExpr(fieldName) + "]:first").focus();
}

function _validateExpress(src, context) {
	var	rv;
	var	el;
	
	rv	= src; 
	el	= /\@\{(.+?)\}/.exec(src);
	if (el == null || el.length == 1) {
		rv	= src;
	} else {
		var	tname;
		
		tname	= el[1];
		rv		= $(":input[name=" + $.escapeExpr(tname) + "]", context).val();
	}
	return rv;
}

/**
 * 기본 제공 유효성 검사 펑션들을 추가합니다.
 * @param funcs 유효성 검사 펑션들 
 * @return
 */
function addValidateFunction(funcs) {
	_validateFncs	= $.extend(_validateFncs, funcs);
}


/**
 * 기본 제공 펑션 등록
 */
$(document).ready(function () {
	addValidateFunction({
		required	: 	function(c, arg) {
							// 필수값 검사
			                if (arg != null && arg[0] == 'trim') {
			                	return $.trim($(c).val()) != "";
			                } else { 
			                	return $(c).val() != "";
			                }
						},
		mustcheck   :   function(c, arg) {
							// 체크횟수 검사
							var	elms;
							var	cc;
							var	min;
							var	max;
							
							elms	= c.form.elements[c.name];
							if (elms.length === undefined) {
								cc	= !c.disabled && c.checked ? 1 : 0;
							} else {
								cc		= 0;
								for (var i=0; i<elms.length; i++) {
									if (!elms[i].disabled && elms[i].checked) {
										cc++;
									}
								}
							}
							if (isNaN(arg[0])) {
								min	= 0;
							} else {
								min	= parseInt(arg[0]);
							}
							if (arg.length < 2) {
								max = min;
							} else {
								if (isNaN(arg[1])) {
									max	= 1;
								} else {
									max	= parseInt(arg[1]);
								}
							}
							
							if(max==0){
								max = 999999;
							}
							
							return cc >= min && cc <= max;
						},
		mustnum		: 	function(c) {
							// 숫자만 가능
							var v	= $(c).val();
							if (v == "") {
								return true;
							}
							return !isNaN(v);
						},
		scompare	: 	function(c, arg) {
							// 문자열 대소등비교
							var v	= $(c).val();
							var o	= arg[0];
							var t	= arg[1];
							
							if (v == "") {
								return true;
							}
							
							if (o == '==' || o == 'eq') {
								return v == t;
							}
							else if (o == '!='  || o == 'ne') {
								return v != t;
							}
							else if (o == '>' || o == 'gt') {
								return v > t;
							}
							else if (o == '>=' || o == 'ge') {
								return v >= t;
							}
							else if (o == '<' || o == 'lt') {
								return v < t;
							}
							else if (o == '<=' || o == 'le') {
								return v <= t;
							}
							return false;
						},
		ncompare	: 	function(c, arg) {
							// 정수 대소등비교
							var v	= $(c).val();
							var o	= arg[0];
							var t	= arg[1];
							var	nv;
							var	nt;

							if (v == "") {
								return true;
							}

							nv	= parseInt(v);
							nt	= parseInt(t);
							
							if (o == '==' || o == 'eq') {
								return nv == nt;
							}
							else if (o == '!=' || o == 'ne') {
								return nv != nt;
							}
							else if (o == '>' || o == 'gt') {
								return nv > nt;
							}
							else if (o == '>=' || o == 'ge') {
								return nv >= nt;
							}
							else if (o == '<' || o == 'lt') {
								return nv < nt;
							}
							else if (o == '<=' || o == 'le') {
								return nv <= nt;
							}
							return false;
						},
		fcompare	: 	function(c, arg) {
							// 실수 대소등비교
							var v	= $(c).val();
							var o	= arg[0];
							var t	= arg[1];
							var	nv;
							var	nt;
							
							if (v == "") {
								return true;
							}

							nv	= parseFloat(v);
							nt	= parseFloat(t);
							
							if (o == '==' || o == 'eq') {
								return nv == nt;
							}
							else if (o == '!=' || o == 'ne') {
								return nv != nt;
							}
							else if (o == '>' || o == 'gt') {
								return nv > nt;
							}
							else if (o == '>=' || o == 'ge') {
								return nv >= nt;
							}
							else if (o == '<' || o == 'lt') {
								return nv < nt;
							}
							else if (o == '<=' || o == 'le') {
								return nv <= nt;
							}
							return false;
						},
		email		: 	function(c) {
							// 이메일형식 체크
							var v	= $(c).val();
							if (v == "") {
								return true;
							}
							return (v.search(/^\s*[\w\~\-\.]+\@[\w\~\-]+(\.[\w\~\-]+)+\s*$/) >= 0);
						},
		date		: 	function(c) {
							// 날짜형식 체크
							var v	= $(c).val();
							if (v == "") {
								return true;
							}
							v = v.replace(/([^0-9\.\-])/g, "");
							if (v.length != 8) {
								return false;
							}
							
							var year = v.substr(0, 4);
							var month = v.substr(4, 2);
							var day = v.substr(6, 2);
							var m = parseInt(month,10);
    						if (!(m >= 1 && m <= 12)) {
								return false;
							}
							
							m = parseInt(month,10) - 1;
						    var d = parseInt(day,10);
						
						    var end = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
						    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
						        end[1] = 29;
						    }
						
						    return (d >= 1 && d <= end[m]);
						},
		regexp      :   function(c, args, argStr) {
							// 정규식 체크
							var v	= $(c).val();
							if (v == "") {
								return true;
							}
						
							var	mch	= new RegExp(argStr, "m").exec(v);
							return mch != null && mch[0] == v;							                       
		                },
		regexpt      :   function(c, args, argStr) {
		                	// 정규식 체크
		                	var v	= $(c).val();
		                	if (v == "") {
		                		return true;
		                	}
		                	var	mch	= new RegExp(argStr, "i").test(v);
		                	return mch;	                        
		                },
		exist_size	: 	function(c, args) {
							// 주어진 이름의 객체의 크기 검사
							var	tname;
							var	minSize;
							var	maxSize;
							var	tform;
							var	tsize;
							
							tname	= args[0];
							if (isNaN(args[1])) {
								minSize	= 0;
							} else {
								minSize	= parseInt(args[1]);
							}
							if (isNaN(args[2])) {
								maxSize	= 99999;
							} else {
								maxSize	= parseInt(args[2]);
							}
							tform	= $(c).parents("form:first");
							tsize	= $(":input[name=" + $.escapeExpr(tname) + "]", tform).length;
							return tsize >= minSize && tsize <= maxSize;
						},
		day_term	: function(c, args) {
							// 두 기간의 날자 간격을 검사
							// 첫번째 인수 제한 간격 (일수)
							// 두번째 인수 비교 대상 (to) 일자
							var	fromDate;
							var fromTimemsecs;
							var toDate;
							var toTimemsecs;
							var	term;
							
							try {
								fromDate	= $.getDate($(c).val());
								toDate		= $.getDate(args[1]);
							} catch (error) {
								// 날자 형식 오류시 벨리데이션 패스
								return true;
							}
							if (fromDate == null || toDate == null) {
								// 기간 시작과 끝중 한쪽이라도 입력이 되어 있지 않으면 패스
								return true;
							}
							fromTimemsecs	= fromDate.getTime();
							toTimemsecs		= toDate.getTime();
							term			= parseInt(args[0]) * 1000 * 60 * 60 * 24;
							return toTimemsecs - fromTimemsecs <= term;
						},
		text8_limit		: function(c, args) {
							// 글짜가 차지할 byte를 기준으로 길이 제한 검사 UTF8기준
							var val;
							var	limit;
							var	length;
							
							if (args.length > 1 && args[1] == "trim") {
								val		= $.trim($(c).val());
							} else {
								val		= $(c).val();
							}
							limit	= parseInt(args[0]);
							length	= $.getByteLength(val, 3);
							return length <= limit;
						},
		text16_limit	: function(c, args) {
							// 글짜가 차지할 byte를 기준으로 길이 제한 검사 UTF16기준
							var val;
							var	limit;
							var	length;
							
							if (args.length > 1 && args[1] == "trim") {
								val		= $.trim($(c).val());
							} else {
								val		= $(c).val();
							}
							limit	= parseInt(args[0]);
							length	= $.getByteLength(val, 2);
							return length <= limit;
						},
		reqexpw	: function(c){
			var cnt=0,cnt2=1,cnt3=1;
	        for(i=0;i < $(c).val().length;i++){
                temp_pass1 = $(c).val().charAt(i);

                ttt = temp_pass1.charCodeAt(0);
                next_pass = (parseInt(temp_pass1.charCodeAt(0)))+1;
                temp_p = $(c).val().charAt(i+1);
                temp_pass2 = (parseInt(temp_p.charCodeAt(0)));
                if (temp_pass2 == next_pass) cnt2 = cnt2 + 1;
                else cnt2 = 1;
                if (temp_pass1 == temp_p) cnt3 = cnt3 + 1;
                else cnt3 = 1;

                if (cnt2 > 3) break;
                if (cnt3 > 3) break;
	        }
	        if (cnt2 > 3){
				return false;
	        }else if(cnt3 > 3){
				return false;
	        }else{
	        	return true;
	        }
		},
		
		reqnotuse	:	function(c){
			var telno;
			telno = $("#bizTel1No").val() + $("#bizTel2No").val() + $("#bizTel3No").val();
			
			if($(c).val() == $("#mgrId").val()){
				return false;
			}else if($("#mgrNm").val() != ''){
				if($(c).val() == $("#mgrNm").val())
					{
					return false;				
					}
			}else  if(telno != ''){
				if($(c).val() == telno) 
					{
						return false;
					}
			}else if($("#emailAddrId").val() != ''){
				var email = $(c).val().substring(0, num);
				if($(c).val() == email) return false;
			}else{
				return true;
			}
			return true;
		},		
		reqexpwwith	: function(c){
			var str = $(c).val();
			//var	rexp	= /^[a-zA-Z][a-zA-Z0-9\-\_\=\+\\\|\(\)\*\&\^\%\$\#\@\!\~\`\?\>\<\/\;\,\.\:\']{5,15}?$/;
			var	rexp	= /^[a-zA-Z0-9\-\_\=\+\\\|\(\)\*\&\^\%\$\#\@\!\~\`\?\>\<\/\;\,\.\:\']{6,32}?$/;
			if (!rexp.test(str)) {
				return false;
			}
			if (!/[0-9]+/.test(str)) {
				return false;
			}
			if (!/[\-\_\=\+\\\|\(\)\*\&\^\%\$\#\@\!\~\`\?\>\<\/\;\,\.\:\']/.test(str)) {
				return false;
			}
			
			return true;
		}						
						
	});
});

/**
 * JQuery selecter 특수 문자 이스케이핑
 * 임시로 여기 위치
 */
$.extend({
	/**
	 * jQuery의 selecter 식에 특수 문자가 포함된 객체 이름을 지정할때
	 * 오동작 하지 않도록 객체 이름을 escaping 합니다.
	 * @param src
	 * @returns
	 */
	escapeExpr : function(src) {
		var	rv;
		
		if (src == null) {
			return null;
		}
		rv	= "";
		for (var i=0; i<src.length; i++) {
			var	cp;
			
			cp	= src.charAt(i);
			switch (cp) {
				case '#':
				case ';':
				case '&':
				case ',':
				case '.':
				case '+':
				case '*':
				case '~':
				case '\'':
				case ':':
				case '\"':
				case '!':
				case '^':
				case '$':
				case '[':
				case ']':
				case '(':
				case ')':
				case '{':
				case '}':
				case '=':
				case '>':
				case '|':
				case '/': 
				case '\\':
					rv	+= '\\' + cp;
					break;
				default:
					rv	+= cp;
			}
		}
		return rv;
	},

	/**
	 * 폼 요소를 모두 클리어 합니다.
	 * @param form
	 * @param clearReadonly true이면 읽기만 가능한 요소도 클리어 합니다(hidden 포함).
	 * @param clearDisabled true이면 disabled 된 요소도 클리어 합니다.
	 * @return
	 */
	clearForm : function (form, clearReadonly, clearDisabled) {
		var	tform;
		var	telms;
		
		if (form == null) {
			return;
		}
		
		if (typeof(form) == "string") {
			tform	= $("form[name=" + $.escapeExpr(form) +"]");
		} else {
			tform	= $(form);
		}
		telms	= clearDisabled ? $(":input", tform) : $(":input:enabled", tform);
		telms.each(function() {
			switch (this.type) {
				case "button":
				case "submit":
				case "reset":
				case "image":
						// 지우지 않음
					break;
				case "hidden":
						if (clearReadonly) {
							this.value	= "";
						}
					break;
				case "text":
				case "textarea":
				case "password":
						if (!this.readOnly || clearReadonly) {
							this.value	= "";
						}
					break;
				case "select-one":
						this.selectedIndex	= 0;
					break;
				case "checkbox":
				case "radio":
						this.checked	= false;
				default :
	//				alert(this.type);
			}
		});
	}, 
	 
	
	/**
	 * 폼 요소를 읽기 전용으로 설정하거나 해제합니다.
	 * @param form
	 * @param readonly true이면 읽기 전용으로 설정하고, false이면 해제합니다.
	 * @return
	 */
	readonlyForm : function (form, readonly) {
		var	tform;
		var	telms;
		var	iptx;
		var	rach;
		
		if (form == null) {
			return;
		}
		
		if (typeof(form) == "string") {
			tform	= $("form[name=" + $.escapeExpr(form) +"]");
		}
		
		iptx	= $("input,textarea", tform);
		rach	= $("input[type=radio], input[type=checkbox]", tform);
		
		if (readonly) {
			iptx.attr("readonly", true);
			iptx.addClass("readonly");
			rach.attr("disabled", true);
		} else {
			iptx.attr("readonly", false);
			iptx.removeClass("readonly");
			rach.attr("disabled", false);
		}
	},
	/**
	 * yyyyMMddHHmmss 혹은 yyyyMMdd 형식의 문자열을 Date 객체로 변환
	 * @param dateExpr
	 * @return
	 */
	getDate : function(dateExpr) {
		var	numText;
		var	year;
		var	month;
		var day;
		var hour;
		var minute;
		var	second;
		var	msec;
		
		if (dateExpr == null || (dateExpr = $.trim(dateExpr)) == "") {
			return null;
		}
		numText	= dateExpr.replace(/[^0-9]/g, '');
		if (numText.length == 17) {
			year	= parseInt(numText.substring(0, 4), 10);
			month	= parseInt(numText.substring(4, 6), 10) - 1;
			day		= parseInt(numText.substring(6, 8), 10);
			hour	= parseInt(numText.substring(8, 10), 10);
			minute	= parseInt(numText.substring(10, 12), 10);
			second	= parseInt(numText.substring(12, 14), 10);
			msec	= parseInt(numText.substring(14, 17), 10);
		}
		else if (numText.length == 14) {
			year	= parseInt(numText.substring(0, 4), 10);
			month	= parseInt(numText.substring(4, 6), 10) - 1;
			day		= parseInt(numText.substring(6, 8), 10);
			hour	= parseInt(numText.substring(8, 10), 10);
			minute	= parseInt(numText.substring(10, 12), 10);
			second	= parseInt(numText.substring(12, 14), 10);
		}
		else if (numText.length == 8) {
			year	= parseInt(numText.substring(0, 4), 10);
			month	= parseInt(numText.substring(4, 6), 10) - 1;
			day		= parseInt(numText.substring(6, 8), 10);
			hour	= 0;
			minute	= 0;
			second	= 0;
			msec	= 0;
		}
		else {
			throw new Error("can't convert Date form '" + dateExpr + "'");
		}
		return new Date(year, month, day, hour, minute, second);
	},
	/**
	 * 글자 길이 계산
	 * @param src 대상 문자열 혹은 폼 엘리먼트
	 * @param unicodeLength 유니코드의 바이트 길이, 생략시 UTF-8 기준 3
	 */
	getByteLength : function(src, unicodeLength) {
		var	length;
		
		length	= 0;
		if (unicodeLength == null) {
			unicodeLength	= 3;
		}
		if (typeof(src) != "string") {
			src	= $(src).val();
		}
		for (var i=0; i<src.length; i++) {
			var	ch;
			
			ch	= src.charCodeAt(i);
			length += ((ch & 0xff00) != 0 ? 3 : 1);
		}
		return length;
	},
	/**
	 * HTML에 글자가 그대로 표현되도록 인코딩 합니다.
	 * @param src
	 */
	encode4Html : function (src, encodeBR, encodeUni) {
        var rv;
        var lastCp;

        if (src == null) {
            return null;
        }

        rv		= "";
        lastCp  = 0;
        for (var i = 0; i < src.length; i++) {
            var    cp;
            var     j;

            cp  = src.charAt(i);
            switch (cp) {
                case "<":
                    rv += "&lt;";
                    break;
                case ">":
                    rv += "&gt;";
                    break;
                case " ":
                    if (lastCp == " ") {
                        rv += "&nbsp;";
                    } else {
                        rv += " ";
                    }
                    break;
                case "\r":
                    j   = i+1;
                    if (j < src.length && src.charAt(j) == "\n") {
                        if (encodeBR) {
                            rv += "<br>\r\n";
                        } else {
                            rv += "\r\n";
                        }
                        i++;
                    } else {
                        rv += "\r";
                    }
                    break;
                case "\n":
                    if (encodeBR) {
                        rv += "<br>\n";
                    } else {
                        rv += "\n";
                    }
                    break;
                case "\"":
                    rv += "&quot;";
                    break;
                case "&":
                    j   = i+1;
                    if (j < src.length() && src.charAt(j) == "#") {
                        rv += "&";
                    } else {
                        rv += "&amp;";
                    }
                    break;
                default:
                    if (encodeUni && (cp < "!" || cp > "~")) {
                        rv += "&#" + cp.charCodeAt(0) + ";";
                    } else {
                        rv += cp;
                    }
                    break;
            }
            lastCp  = cp;
        }
        return rv;		
	}
});