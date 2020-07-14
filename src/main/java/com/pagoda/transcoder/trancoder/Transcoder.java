package com.pagoda.transcoder.trancoder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Scanner;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pagoda.common.SpringApplicationContext;
import com.pagoda.transcoder.web.websocket.WebsocketEndPoint;

public class Transcoder implements Runnable {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(Transcoder.class);
	
	public static BlockingQueue<Map<String, Object>> queue = new LinkedBlockingQueue<Map<String, Object>>();
	public static Map<String, Object> currentJob;
	
	private String encodeFFmpegPath;
	private String encodeSourcePath;
	private String encodeTargetPath;
	private String serviceDomain;
	private String encodeRoot;

	public void init() throws Exception {
		Properties sp = System.getProperties();
		String active = (String) sp.get("spring.profiles.active");
		
		if( active == null || "".equals(active) ){
			System.out.println("*********************************************************" );
			System.out.println("*  spring.profiles.active properties does not setting.  *" ); 
			System.out.println("*  To make set -Dspring.profiles.active                 *" ); 
			System.out.println("*   1) -Dspring.profiles.active=dev  ( Develop Mode )   *" ); 
			System.out.println("*   2) -Dspring.profiles.active=prod ( Product Mode )   *" ); 
			System.out.println("*  Transcoder Service was stoped.                       *" );
			System.out.println("*********************************************************" );
			System.exit(0);
		}
		
		Properties pro = new Properties();
	    pro.load(this.getClass().getClassLoader().getResourceAsStream("properties/" + active + ".properties"));
	    encodeFFmpegPath = pro.getProperty("encode.ffmpeg.path");
	    encodeSourcePath = pro.getProperty("encode.source.path");
	    encodeTargetPath = pro.getProperty("encode.target.path");
	    serviceDomain = pro.getProperty("Service.domain");
	    encodeRoot = pro.getProperty("encode.root");
	    
	    LOGGER.info("+--------------------------------------------------------------------------+");
		LOGGER.info("|   Transcoder Thread START.                                               |");
		LOGGER.info("+--------------------------------------------------------------------------+");
		LOGGER.info("|   encodeFFmpegPath 	: " + encodeFFmpegPath);
		LOGGER.info("|   encodeSourcePath 	: " + encodeSourcePath);
		LOGGER.info("|   encodeTargetPath 	: " + encodeTargetPath);
		LOGGER.info("|   serviceDomain 	    : " + serviceDomain);
		LOGGER.info("|   encodeRoot 		: " + encodeRoot);
		LOGGER.info("+--------------------------------------------------------------------------+");
	}
	
	@Override
	public void run() {
		// TODO Auto-generated method stub		
		try{
			
			init();
			
			while(true){
				
				Thread.sleep(1000);
				
				currentJob = queue.take();
				transcodStart(currentJob);
				currentJob = null;
				
			}
		}catch (Exception ex){
			ex.printStackTrace();
		}

	}
	
	private void transcodStart(Map<String, Object> commandMap) throws IOException{
		
		List<String> command = new ArrayList<String>();
		
		String fileid = (String) commandMap.get("fileid");
		//filename = filename.substring(filename.lastIndexOf("/") + 1,filename.lastIndexOf(".") - 1);
		
		LOGGER.info("sourceFilePath = " + commandMap.get("sourceFilePath"));
		LOGGER.info("targetFilePath = " + encodeTargetPath + "/" + fileid  + ".mp4");

		ProcessBuilder pb = new ProcessBuilder();
		
		command.add(encodeFFmpegPath);
		command.add("-y");
		command.add("-i");
		command.add((String) commandMap.get("sourceFilePath"));
		
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
		
		command.add(encodeTargetPath + "/" + fileid + ".mp4");
		
		pb.command(command);
		
		LOGGER.info("command = " + pb.command().toString().replace(",", ""));
		Process p = pb.start();

		WebsocketEndPoint websocketEndPoint = (WebsocketEndPoint) SpringApplicationContext.getBean("websocketHandler");
		
		String clientSessionId = (String) commandMap.get("clientSessionId"); 
		LOGGER.info("ClientSessionId = " + clientSessionId);
		
		@SuppressWarnings("resource")
		Scanner sc = new Scanner(p.getErrorStream());

		// Find duration
		Pattern durPattern = Pattern.compile("(?<=Duration: )[^,]*");
		String dur = sc.findWithinHorizon(durPattern, 0);

		if (dur == null) throw new RuntimeException("Could not parse duration.");
		
		String[] hms = dur.split(":");
		double totalSecs = Integer.parseInt(hms[0]) * 3600 + Integer.parseInt(hms[1]) * 60 + Double.parseDouble(hms[2]);
		
		LOGGER.info("Total duration: " + totalSecs + " seconds.");

		// Find time as long as possible.
		Pattern timePattern = Pattern.compile("(?<=time=)[^ b]*");
		String match;
		while (null != (match = sc.findWithinHorizon(timePattern, 0))) {

			String[] chms = match.split(":");

			double curSec = Integer.parseInt(chms[0]) * 3600 + Integer.parseInt(chms[1]) * 60 + Double.parseDouble(chms[2]);

			double progress = curSec / totalSecs;
			LOGGER.info("progress........[" + Math.round((progress) * 100) + "%]");

			try {
				websocketEndPoint.sendClientAll((String) commandMap.get("fileid"), Math.round((progress) * 100) + "");
				websocketEndPoint.sendClient(clientSessionId, Math.round((progress) * 100) + "");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		// 변환 완료
		try {
			websocketEndPoint.sendClientAllComplete((String) commandMap.get("fileid"), "http://" + serviceDomain + encodeRoot + "/" + fileid + ".mp4");
			websocketEndPoint.sendClientComplete(clientSessionId, "http://" + serviceDomain + encodeRoot + "/" + fileid + ".mp4");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
