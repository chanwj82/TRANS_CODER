package com.pagoda.transcoder.web.login.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pagoda.transcoder.web.login.model.User;

public interface LoginService {
	
	/**
	 * 로그인
	 * 
	 * @param PortingData portingData
	 * @return boolean
	 * @throws Exception
	 */
	public boolean login(HttpServletRequest request, User user) throws Exception;
	
	/**
	 * 로그아웃
	 * 
	 * @param PortingData portingData
	 * @return boolean
	 * @throws Exception
	 */
	public void logout(HttpServletRequest request, HttpServletResponse response, User user) throws Exception;
	
	public String ehcacheTest1(HttpServletRequest request, User user);
	public String ehcacheTest2(HttpServletRequest request, User user);
	public String ehcacheTest3(HttpServletRequest request, User user);
	
	public void clearEhcache();

}
