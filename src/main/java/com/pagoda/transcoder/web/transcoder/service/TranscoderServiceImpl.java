package com.pagoda.transcoder.web.transcoder.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pagoda.common.SpringApplicationContext;
import com.pagoda.transcoder.trancoder.Transcoder;
import com.pagoda.transcoder.web.websocket.WebsocketEndPoint;


@Service
public class TranscoderServiceImpl implements TranscoderService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TranscoderServiceImpl.class);
	
	@Value("#{properties['encode.source.path']}")
	private String encodeSourcePath;

	@Value("#{properties['encode.target.path']}")
	private String encodeTargetPath;
	
	@Value("#{properties['encode.ffmpeg.path']}")
	private String encodeFFmpegPath;

	@Override
	public void transcoderStart1(HttpServletRequest request, Map<String, Object> commandMap) throws IOException {
		// TODO Auto-generated method stub
		
		
	}

	@Override
	public void transcoderStart2(HttpServletRequest request, Map<String, Object> commandMap) throws IOException {
		// TODO Auto-generated method stub
		
		List<String> command = new ArrayList<String>();
		
		String sourceFilePath = (String) commandMap.get("sourceFilePath");
		String fileName = (String) commandMap.get("fileName");

		LOGGER.debug("sourceFilePath = " + sourceFilePath);
		LOGGER.debug("targetFilePath = " + encodeTargetPath + "/" + fileName + ".mp4");

		ProcessBuilder pb = new ProcessBuilder();
		
		command.add(encodeFFmpegPath);
		command.add("-y");
		command.add("-i");
		command.add(sourceFilePath);
		
		// 해상도 
		if( !"".equals(commandMap.get("resolution") ) ){
			command.add("-filter:v");
			command.add("scale=" + commandMap.get("resolution"));
		}
		// Video 코덱
		command.add("-c:v");
		command.add((String) commandMap.get("videoCodec"));
		
		// Video 비트레이트
		if( !"".equals(commandMap.get("videoBitRate") ) ){
			command.add("-b:v");
			command.add((String) commandMap.get("videoBitRate"));
		}
		
		// Audio 코덱
		command.add("-c:a");
		command.add((String) commandMap.get("audioCodec"));
		
		// Audio 비트레이트
		if( !"".equals(commandMap.get("audioBitRate") ) ){
			command.add("-b:a");
			command.add((String) commandMap.get("audioBitRate"));
		}
		
		command.add(encodeTargetPath + "/" + fileName + ".mp4");
		
		pb.command(command);
		
		LOGGER.debug("command = " + pb.command().toString().replace(",", ""));
		Process p = pb.start();

		WebsocketEndPoint websocketEndPoint = (WebsocketEndPoint) SpringApplicationContext.getBean("websocketHandler");
		
		String clientSessionId = (String) commandMap.get("clientSessionId"); 
		LOGGER.debug("ClientSessionId = " + clientSessionId);
		
		@SuppressWarnings("resource")
		Scanner sc = new Scanner(p.getErrorStream());

		// Find duration
		Pattern durPattern = Pattern.compile("(?<=Duration: )[^,]*");
		String dur = sc.findWithinHorizon(durPattern, 0);

		if (dur == null) throw new RuntimeException("Could not parse duration.");
		
		String[] hms = dur.split(":");
		double totalSecs = Integer.parseInt(hms[0]) * 3600 + Integer.parseInt(hms[1]) * 60 + Double.parseDouble(hms[2]);
		
		LOGGER.debug("Total duration: " + totalSecs + " seconds.");

		// Find time as long as possible.
		Pattern timePattern = Pattern.compile("(?<=time=)[^ b]*");
		String match;
		while (null != (match = sc.findWithinHorizon(timePattern, 0))) {

			String[] chms = match.split(":");

			double curSec = Integer.parseInt(chms[0]) * 3600 + Integer.parseInt(chms[1]) * 60 + Double.parseDouble(chms[2]);
			double progress = curSec / totalSecs;

			websocketEndPoint.sendClient(clientSessionId, Math.round((progress) * 100) + "");
		}
		//p.waitFor();
	}

	@Override
	public void transcoderStart3(HttpServletRequest request, Map<String, Object> commandMap) throws IOException {
		// TODO Auto-generated method stub
		
		WebsocketEndPoint websocketEndPoint = (WebsocketEndPoint) SpringApplicationContext.getBean("websocketHandler");
		
		String fileid = (String) commandMap.get("fileid");
		String filename = (String) commandMap.get("filename");
		
		LOGGER.debug("fileid : " + fileid);
		
		Transcoder.queue.add(commandMap);

		websocketEndPoint.sendClientAllAdd(fileid, filename);

	}

}
