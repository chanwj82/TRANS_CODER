package com.pagoda.transcoder;

import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.WebAppContext;
import org.eclipse.jetty.xml.XmlConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hazelcast.session.HazelcastSessionIdManager;
import com.pagoda.transcoder.trancoder.Transcoder;

public class HttpdTranscoderStart implements Runnable  {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
	
	protected Server server;
	protected Thread thread;
	protected int port;
	protected String active;
	protected String workerName = "";
	protected String webAppContextPath = "/";
		
	public void init() throws Exception
    {
		
		Properties sp = System.getProperties();
		active = (String) sp.get("spring.profiles.active");
		
		if( active == null || "".equals(active) ){
			/*
			System.setProperty("spring.profiles.active", "local");
			LOGGER.info("*********************************************************" );
			LOGGER.info("*  spring.profiles.active properties does not setting.  *" ); 
			LOGGER.info("*  spring.profiles.active setting to default [local]    *" );
			LOGGER.info("*********************************************************" );
			*/
			
			System.out.println("*********************************************************" );
			System.out.println("*  spring.profiles.active properties does not setting.  *" ); 
			System.out.println("*  To make set -Dspring.profiles.active                 *" ); 
			System.out.println("*   1) -Dspring.profiles.active=dev  ( Develop Mode )   *" ); 
			System.out.println("*   2) -Dspring.profiles.active=prod ( Product Mode )   *" ); 
			System.out.println("*  Transcoder Service was stoped.                       *" );
			System.out.println("*********************************************************" );
			System.exit(0);
			
		}
		
		Resource jettyXml = Resource.newClassPathResource("jetty.xml"); 
        XmlConfiguration configuration = new XmlConfiguration(jettyXml.getInputStream());
        server = (Server)configuration.configure();    
        
        HazelcastSessionIdManager hazelcastSessionIM = server.getBean(HazelcastSessionIdManager.class);
        if( hazelcastSessionIM != null ){
        	workerName = (String) sp.get("ServiceName");
        	if( StringUtils.isEmpty(workerName) ) workerName = hazelcastSessionIM.getWorkerName();
        	else hazelcastSessionIM.setWorkerName(workerName);
        }

        HandlerCollection hc = (HandlerCollection) server.getHandlers()[0];
        WebAppContext webAppContext = (WebAppContext) hc.getHandlers()[0];
        if( webAppContext != null ){
        	webAppContextPath = (String) sp.get("WebAppContextPath");
        	if( StringUtils.isEmpty(webAppContextPath) ) webAppContextPath = webAppContext.getContextPath();
        	else webAppContext.setContextPath(webAppContextPath);
        }

        ServerConnector sc = (ServerConnector) server.getBean(ServerConnector.class);
        if( sc != null ){
        	port = sc.getPort();
        	try{
        		if( StringUtils.isNotEmpty((String) sp.get("ServiceHttpdPort")) ) {
        			port = Integer.parseInt( (String) sp.get("ServiceHttpdPort"));
        		}
        		
        	} catch ( Exception e ){}
        	
        	sc.setPort(port);
        }

        thread = new Thread(this);
    }
	
	public void start() 
    {
    	thread.start();
    }
 
	@Override
    public void run() 
    {
        try 
        {
        	LOGGER.info("+-----------------------------------------------------+");
    		LOGGER.info("|   Http Transcoder Demon START..");
    		LOGGER.info("|   workerName         : " + workerName );
    		LOGGER.info("|   port               : " + port );
    		LOGGER.info("|   webAppContextPath  : " + webAppContextPath );
    		LOGGER.info("|   Version            : 1.0 ");
    		LOGGER.info("|   Created            : chanwj ");
    		LOGGER.info("+-----------------------------------------------------+");

        	server.start();
        	server.join();
        }
        catch (Exception e) 
        {
            throw new RuntimeException(e);
        }
    }
 
    public void stop() 
    {
        try 
        {
        	server.stop();
        	server.destroy();
        }
        catch (Exception e) 
        {
            throw new RuntimeException(e);
        }
    }
 
	
	public static void main(String[] args) throws Exception{
		
		Runtime.getRuntime().addShutdownHook(new Thread() {
			public void run() {
				LOGGER.info("Transcoder shutdown...");
			}
		});
		
		
		HttpdTranscoderStart d = new HttpdTranscoderStart();
		d.init();
		d.start();
		
		Thread.sleep(2000);
		
		// Transcoder thread start
		
		Thread t = new Thread(new Transcoder());
		t.start();

	}


}
