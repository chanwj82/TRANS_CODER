package com.pagoda.transcoder.web.websocket;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebsocketEndPoint extends TextWebSocketHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(WebsocketEndPoint.class);
	private static Map<String,WebSocketSession> clientMap = new HashMap<String,WebSocketSession>();

	public WebsocketEndPoint() {
		super();
	}

	// 클라이언트에서 접속을 하여 성공할 경우 발생하는 이벤트
	@SuppressWarnings("unchecked")
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		super.afterConnectionEstablished(session);
		
		clientMap.put(session.getId(), session);

		LOGGER.debug("**** Session Connected	> sessionId [" + session.getId() + "] ****");
		JSONObject obj = new JSONObject();
		obj.put("clientSessionId", session.getId());
		obj.put("eventId", "connect");
		session.sendMessage(new TextMessage(obj.toJSONString()));

	}

	// 클라이언트에서 send를 이용해서 메시지 발송을 한 경우 이벤트 핸들링
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String payloadMessage = message.getPayload();

		LOGGER.debug("handleTextMessage : " + payloadMessage);
		if (session!= null && session.isOpen()) {
			session.sendMessage(new TextMessage("ECHO : " + payloadMessage));
		}

	}

	// 클라이언트에서 연결을 종료할 경우 발생하는 이벤트
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		super.afterConnectionClosed(session, status);
		LOGGER.debug("#### Session Closed	> sessionId [" + session.getId() + "] ####");
		clientMap.remove(session.getId());
	}
	
	@SuppressWarnings("unchecked")
	public void sendClient(String clientSessionId, String message) throws IOException{
		if ( clientMap.get(clientSessionId) != null && clientMap.get(clientSessionId).isOpen()) {
			JSONObject obj = new JSONObject();
			obj.put("clientSessionId", clientMap.get(clientSessionId).getId());
			obj.put("eventId", "send");
			obj.put("message", message);
			LOGGER.debug("	> client [ " + clientMap.get(clientSessionId).getId() + " ] sendClient : " + message);
			clientMap.get(clientSessionId).sendMessage(new TextMessage(obj.toJSONString()));
		}
	}
	
	@SuppressWarnings("unchecked")
	public void sendClientComplete(String clientSessionId, String message) throws IOException{
		if ( clientMap.get(clientSessionId) != null && clientMap.get(clientSessionId).isOpen()) {
			JSONObject obj = new JSONObject();
			obj.put("clientSessionId", clientMap.get(clientSessionId).getId());
			obj.put("eventId", "complete");
			obj.put("message", message);
			LOGGER.debug("	> clientComplete [ " + clientMap.get(clientSessionId).getId() + " ] sendClient : " + message);
			clientMap.get(clientSessionId).sendMessage(new TextMessage(obj.toJSONString()));
		}
	}
	
	@SuppressWarnings("unchecked")
	public synchronized void sendClientAllAdd(String fileid, String filename) throws IOException{
		JSONObject obj = new JSONObject();
		obj.put("eventId", "add");
		obj.put("fileid", fileid);
		obj.put("filename", filename);
		LOGGER.debug("	> sendClientAllAdd fileId [" + fileid + "]");
		Iterator<String> keys = clientMap.keySet().iterator();
        while( keys.hasNext() ){
            String key = keys.next();
            clientMap.get(key).sendMessage(new TextMessage(obj.toJSONString()));
        }
	}
	
	@SuppressWarnings("unchecked")
	public synchronized void sendClientAll(String fileid,String progress) throws IOException{
		JSONObject obj = new JSONObject();
		obj.put("eventId", "sendAll");
		obj.put("fileid", fileid);
		obj.put("progress", progress);
		
		Iterator<String> keys = clientMap.keySet().iterator();
        while( keys.hasNext() ){
            String key = keys.next();
            LOGGER.debug("	> clientAll sendClient key ["+key+"] [" + fileid + "] : " + progress);
            clientMap.get(key).sendMessage(new TextMessage(obj.toJSONString()));
        }
	}
	
	@SuppressWarnings("unchecked")
	public synchronized void sendClientAllComplete(String fileid,String url) throws IOException{

		JSONObject obj = new JSONObject();
		obj.put("eventId", "completeAll");
		obj.put("fileid", fileid);
		obj.put("url", url);
		LOGGER.debug("	> clientAllComplete sendClient [" + fileid + "] : " + url);
		Iterator<String> keys = clientMap.keySet().iterator();
        while( keys.hasNext() ){
            String key = keys.next();
            clientMap.get(key).sendMessage(new TextMessage(obj.toJSONString()));
        }
	}

}
