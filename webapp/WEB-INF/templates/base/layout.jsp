<%@ taglib prefix="tiles"	uri="http://tiles.apache.org/tags-tiles" %>
<!DOCTYPE html>
<head>
<title>PAGODA TRANSCODER SERVICE</title>
<%@ include file="/WEB-INF/views/cmm/include/stylesheets.jsp" %>
<%@ include file="/WEB-INF/views/cmm/include/scripts.jsp" %>


<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<!--[if lt IE 9]>
    <script src="//js/html5Shiv.js"></script>
	<script src="//js/css3-mediaqueries.js"></script>
<![endif]-->

</head>
 
<body>
    <!-- start #wrap -->
	<div id="wrap">
		<tiles:insertAttribute name="header"/>
		<hr />
        <tiles:insertAttribute name="body"/>
        <hr />
        <tiles:insertAttribute name="footer"/>
    </div> 
</body>
</html>