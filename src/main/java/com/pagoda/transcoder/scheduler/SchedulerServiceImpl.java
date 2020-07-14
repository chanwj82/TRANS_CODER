package com.pagoda.transcoder.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pagoda.common.scheduler.SchedulerService;

public class SchedulerServiceImpl implements SchedulerService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SchedulerServiceImpl.class);

	@Override
	public void runScheduler() throws Exception {
		// TODO Auto-generated method stub
		LOGGER.info("Transcoder scheduler start..");
	}

}
