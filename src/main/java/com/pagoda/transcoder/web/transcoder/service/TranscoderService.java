package com.pagoda.transcoder.web.transcoder.service;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface TranscoderService {
	
	public void transcoderStart1(HttpServletRequest request, Map<String, Object> commandMap) throws IOException;
	
	public void transcoderStart2(HttpServletRequest request, Map<String, Object> commandMap) throws IOException;
	
	public void transcoderStart3(HttpServletRequest request, Map<String, Object> commandMap) throws IOException;
	

}
