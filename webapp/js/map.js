var oMap;
var mapInfoWindow;
var oLabel;
var branCode;
var category;
var brans;
var markerCount = 0;
var oPartnerMarker;
var preZIndex;
var partnerObj = new Object();

// 네이버 맵객체 생성
function createMap(branCode, divId) {
	loadBranch();

	
	var oPoint = brans.get(branCode, "XY");
	nhn.api.map.setDefaultPoint('TM128');
	oMap = new nhn.api.map.Map(divId ,{
				point : oPoint,
				zoom : 12,
				enableWheelZoom : true,
				enableDragPan : true,
				enableDblClickZoom : false,
				mapMode : 0,
				activateTrafficMap : false,
				activateBicycleMap : false,
				minMaxLevel : [ 1, 14 ],
				size : new nhn.api.map.Size(jQuery("#" + divId).width(), jQuery("#" + divId).height())
			});
	
	var oSlider = new nhn.api.map.ZoomControl();
	oMap.addControl(oSlider);
	oSlider.setPosition({
		top : 10,
		left : 10
	});
	
	var oBranMarker = new nhn.api.map.Marker(
			new nhn.api.map.Icon(
				/*
				'http://dev99.pagoda21.com/images/map/b' + branCode + '.gif',
				new nhn.api.map.Size(80, 30), 
				new nhn.api.map.Size(40, 30)
				*/
				'http://www.pagoda21.com/images/map/ic_map_pagoda.gif',
				new nhn.api.map.Size(68, 28), 
				new nhn.api.map.Size(34, 28)
			),  
			{
				point : brans.get(branCode, "XY"),
				title : brans.get(branCode, "NM"),
				zIndex:9999
			}
	);
	
	jQuery(oBranMarker).attr("mIndex", branCode);
	jQuery(oBranMarker).attr("mType", "bran");
	oMap.addOverlay(oBranMarker);
	
	
	mapInfoWindow = new nhn.api.map.InfoWindow(); // - info window 생성
	mapInfoWindow.setVisible(false); // - infowindow 표시 여부 지정.
	oMap.addOverlay(mapInfoWindow);	// - 지도에 추가.	 
	
	oLabel = new nhn.api.map.MarkerLabel(); // - 마커 라벨 선언.
	oMap.addOverlay(oLabel); // - 마커 라벨 지도에 추가. 기본은 라벨이 보이지 않는 상태로 추가됨.

	mapInfoWindow.attach('changeVisible', function(oCustomEvent) {
		if (oCustomEvent.visible) {
			oLabel.setVisible(false);
		}
	});

	oMap.attach('mouseenter', function(oCustomEvent) {
		var oTarget = oCustomEvent.target;
		// 마커위에 마우스 올라간거면
		if (oTarget instanceof nhn.api.map.Marker) {
			var oMarker = oTarget;
			oMarker.setZIndex(oMarker.getZIndex()+10000);
			oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
			/*
			if (oMarker.getZIndex() > 0) {
				oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
			}
			*/
		}
	});

	oMap.attach('mouseleave', function(oCustomEvent) {
		var oTarget = oCustomEvent.target;
		// 마커위에서 마우스 나간거면
		if (oTarget instanceof nhn.api.map.Marker) {
			var oMarker = oTarget;
			oMarker.setZIndex(oMarker.getZIndex()-10000);
			oLabel.setVisible(false);
		}
	});

	oMap.attach('click', function(oCustomEvent) {
		var oPoint = oCustomEvent.point;
		var oTarget = oCustomEvent.target;
		var mIndex;
		var mType;

		mapInfoWindow.setVisible(false);
		// 마커 클릭하면
		if (oTarget instanceof nhn.api.map.Marker) {
			// 겹침 마커 클릭한거면
			if (oCustomEvent.clickCoveredMarker) {
				mapInfoWindow.setVisible(false);
				return;
			}
			
			mIndex = jQuery(oTarget).attr("mIndex");
			mType = jQuery(oTarget).attr("mType");
			
			// - InfoWindow 에 들어갈 내용은 setContent 로 자유롭게 넣을 수 있습니다. 외부 css를 이용할 수 있으며, 
			// - 외부 css에 선언된 class를 이용하면 해당 class의 스타일을 바로 적용할 수 있습니다.
			// - 단, DIV 의 position style 은 absolute 가 되면 안되며, 
			// - absolute 의 경우 autoPosition 이 동작하지 않습니다.
			if (mType.toString() == "bran") {
				/*
				mapInfoWindow.setContent(
						'<DIV style="border-top:1px solid; border-bottom:2px groove black; border-left:1px solid; border-right:2px groove black;margin-bottom:1px;color:black;background-color:white; width:auto; height:auto;">'+
						'<span style="color: #000000 !important;display: inline-block;font-size: 12px !important;font-weight: bold !important;letter-spacing: -1px !important;white-space: nowrap !important; padding: 2px 2px 2px 2px !important">' +
						'<table>' +
						'<tr><td rowspan="3"><img src="http://dev99.pagoda21.com/images/map/'+ brans.get(mIndex, "IMG") + '"></td><td>' + brans.get(mIndex, "NM") + '</td></tr>' +
						'<tr><td>'+ brans.get(mIndex, "TEL") + '</td></tr>' +
						'<tr><td>'+ brans.get(mIndex, "ADDR") + '</td></tr>' +
						'</table>' +
						'<span></div>');
				mapInfoWindow.setPoint(oTarget.getPoint());
				mapInfoWindow.setVisible(true);
				mapInfoWindow.setPosition({right : 15, top : 30});
				mapInfoWindow.autoPosition();
				*/
			} else {
				partnerWindowShow(mapInfoWindow, mIndex);
			}
			return;
		}
	});
}

function partnerWindowShow(wObj, num) {
	wObj.setContent(
            '<div style=" width:317px; min-height:80px; border:1px solid #000; background:#fff url(/images/institute/map_line.gif) 80px top repeat-y;  z-index:100; overflow:hidden; ">'+ 
            '    <div style="position:absolute; top:0; right:0;  cursor:pointer; z-index:100;" onclick="partnerWindowHide();">'+
            '        <img src="/images/institute/btn_close.gif" style="border:0; "/>'+
            '    </div>'+
            '    <div style="float:left; text-align:center; width:80px; ">'+
            '        <img src="http://www.pagoda21.com/upload/customer/partner/'+ partnerObj[num].bizimage + '" style="width:70px; height:70px; margin:5px 0 0 0; ">'+
            '    </div>'+
            '    <dl style=" float:left; width:200px; margin:15px 0 0 15px; padding:0 0 10px 0;  ">'+
            '        <dt style="color:#333; font-weight:bold; font-size:14px;">' + partnerObj[num].partnername + '</dt>'+
            '        <dd style="color:#666; margin:5px 0 5px 0; line-height:1.4;"><em style="color:#ba191e; font-size:12px; font-weight:bold;">'+ partnerObj[num].commonbenefit + '</em></dd>'+
            '        <dd style="color:#666; line-height:1.4;"><b>• 연락처</b> : '+ partnerObj[num].phone + '<br/>' + //<b>• 특이사항</b></dd>'+
            //'        <dd style="color:#666; line-height:1.4;padding-left:5px;">' + partnerObj[num].etcitem + '</dd>'+
            '    </dl>'+
            '</div>'			
	);
	wObj.setPoint(new nhn.api.map.TM128(Number(partnerObj[num].mapx), Number(partnerObj[num].mapy)));
	wObj.setVisible(true);
	wObj.setPosition({right : 15, top : 25});
	wObj.autoPosition();
}

function partnerWindowHide() {
	mapInfoWindow.setVisible(false);
}


// 학원 정보 객체
function Branch()
{
	this.bimgW = 80;
	this.bimgH = 30;
	this.CD = new Array();
	this.NM = new Array();
	this.XY = new Array();
	this.TEL = new Array();
	this.ADDR = new Array();
	this.ETC1 = new Array();
	this.URL = new Array();
	this.IMG = new Array();
	this.MNM = new Array();

	this.size = function(){return this.CD.length;};

	this.add = AddBran;
	this.get = GetValue;
	this.getAttr = GetAttr;

	function AddBran(cd,nm,xy,tel,addr,etc1,url,img,mnm)
	{
		this.CD[this.CD.length] = cd;
		this.NM[this.NM.length] = nm;
		this.XY[this.XY.length] = xy;
		this.TEL[this.TEL.length] = tel;
		this.ADDR[this.ADDR.length] = addr;
		this.ETC1[this.ETC1.length] = etc1;
		this.URL[this.URL.length] = url;
		this.IMG[this.IMG.length] = img;
		this.MNM[this.MNM.length] = mnm;
	}

	function GetValue(cd,w)
	{
		for(i=0; i<this.CD.length; i++) {
			if(this.CD[i]==cd) {
				return this.getAttr(i,w);
			}
		}
	}

	function GetAttr(i,w)
	{
		var ret;
		switch(w) {
			case "CD"	: ret = this.CD[i]; break;
			case "NM"	: ret = this.NM[i]; break;
			case "XY"	: ret = this.XY[i]; break;
			case "TEL"	: ret = this.TEL[i]; break;
			case "ADDR" : ret = this.ADDR[i]; break;
			case "ETC1" : ret = this.ETC1[i]; break;
			case "URL"  : ret = this.URL[i]; break;
			case "IMG"  : ret = this.IMG[i]; break;
			case "MNM"  : ret = this.MNM[i]; break;
			default : ret = ""; break;
		}
		return ret;
	}
}

// 학원 정보 생성
function loadBranch() {
	brans = new Branch();
	
	//신촌 S1
	brans.add("02","항상 생동감있고 살아있는 젊음.파고다 신촌",new nhn.api.map.TM128(306473,550971)
				,"(02)717-4000"
				,"서울시 서대문구 창천동 20-41 아남인베스텔 3~5F",""
				,"http://www.pagoda21.com/academy/shinchon/main.do?code=82"
				,"bran_s1.jpg", "신촌");

	//신촌 S2
	brans.add("22","페리움 토플센터 대한민국 No1. TOEFL Perium",new nhn.api.map.TM128(306443,550949)
				,"(02)313-1005"
				,"서울특별시 서대문구 창천동 20-51번지 신영스카이텔 4-5층",""
				,"http://www.pagoda21.com/academy/shinchon/main.do?code=82"
				,"bran_s2.jpg", "신촌 토플학원");
	//강남
	brans.add("04","Best of best! 어학의 중심.파고다 강남",new nhn.api.map.TM128(314088,544622)
				,"(02)2051-4000"
				,"서울 서초구 서초동 1306-6 파고다타워 3층",""
				,"http://www.pagoda21.com/academy/gangnam/main.do"
				,"bran_kangnam.jpg", "강남");

	//구로
	brans.add("06","프리미엄급의 소수정예 고품격 외국어 전문학원입니다.",new nhn.api.map.TM128(302675,543213)
				,"(02)2156-4000"
				,"서울시 구로구 구로동 182-13 대륭포스트타워 2차",""
				,"http://www.pagodaprime.com"
				,"bran_guro.jpg", "구로");

	//종로j1
	brans.add("01","최고의 강의 Know-How와 강사진.파고다 종로",new nhn.api.map.TM128(310818,552448)
				,"(02)2274-4000"
				,"서울 특별시 종로구 종로 2가 56-6  [종로 2가 탑골공원 맞은편]",""
				,"http://www.pagoda21.com/academy/jongro/main.do?code=81"
				,"bran_j1.jpg", "종로(본원)");

	//종로타워 파고다
	brans.add("21","파고다타워 종로",new nhn.api.map.TM128(310798,552299)
				,"(02) 2274-4000"
				,"서울 특별시 종로구 관철동 5-13 외 2필지 (종로지점)",""
				,"http://www.pagoda21.com/academy/jongro/main.do?code=81"
				,"bran_j5.jpg", "종로타워(청계천)");

	//부평
	brans.add("12","21C 국제화시대를 선도해 나갈 전문인력 양성.파고다 부평",new nhn.api.map.TM128(287235,544088)
				,"(032)526-4000"
				,"인천시 부평구 부평1동 549-36 2F (주)파고다아카데미",""
				,"http://www.pagoda21.com/academy/bupyung/main.do?code=84"
				,"bran_bupyung.jpg", "부평");
	//부산
	brans.add("05","외국어교육의 선두주자. PAGODA 서면",new nhn.api.map.TM128(496666,284343)
				,"(051) 802-4001"
				,"부산광역시 진구 부전 2동 232-2번지 (주)파고다아카데미  ",""
				,"http://www.pagoda21.com/academy/busan/main.do?code=83"
				,"bran_b1.jpg", "부산");

	//부산대
	brans.add("30","국제적인 감각과 능력을 지닌 세계인 양성.파고다 부산대",new nhn.api.map.TM128(499268,292981)
				,"(051) 515-4001"
				,"부산시 장전3동 414-20번지 광명빌딩 3층 파고다 어학원",""
				,"http://www.pagoda21.com/academy/busanuniv/main.do?code=85"
				,"bran_busandae.jpg", "부산대");

	//여의도
	brans.add("08","최고의 강사와 최상의 교육 서비스로 여러분의 외국의 향상을 책임지겠습니다.",new nhn.api.map.TM128(305069,547379)
				,"02)6929-4000"
				,"서울시 영등포구 여의도동 23-7 유화증권빌딩 15층",""
				,"http://www.pagoda21.com/academy/yeouido/main.do?code=88"
				,"bran_busandae.jpg", "여의도");	
	
	//부산대연
	brans.add("25","대학생이 다니고 싶은 어학원 1위 파고다! 대연학원.",new nhn.api.map.TM128(500540,282726)
				,"051)710-4000"
				,"부산광역시 남구대연동 73-1 태강플라자빌딜 8층",""
				,"http://www.pagoda21.com/academy/busandaeyeon/main.do?code=89"
				,"bran_busandaeyeon.jpg", "대연");	
}

