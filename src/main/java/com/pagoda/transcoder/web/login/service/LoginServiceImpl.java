package com.pagoda.transcoder.web.login.service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.pagoda.common.Constants;
import com.pagoda.framework.core.util.crypto.CipherAES;
import com.pagoda.transcoder.web.login.model.User;

@Service
public class LoginServiceImpl implements LoginService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(LoginServiceImpl.class);
	
	@Resource(name = "memberCipher")
	private CipherAES cipher;

	@Value("#{properties['login.id']}")
	private String loginId;
	
	@Value("#{properties['login.pw']}")
	private String loginPw;
	
	@Value("#{properties['login.name']}")
	private String loginName;
	
	@Value("#{properties['login.email']}")
	private String loginEmail;
	
	@Value("#{properties['login.phone']}")
	private String loginPhone;

	@Override
	public boolean login(HttpServletRequest request, User user) throws Exception {
		// TODO Auto-generated method stub
		boolean loginSuccess = false;
		User login = null;
		user.setPasswd(cipher.encryption(user.getPasswd()));
		
		if( loginId.equals(user.getId()) && loginPw.equals(user.getPasswd()) ){
			login = user;
			login.setName(loginName);
			login.setEmail(loginEmail);
			login.setPhone(loginPhone);
		}
		
		if( login != null ){
			//session 생성
			login.setPasswd(null); //비번은 숨김
			request.getSession(true).setAttribute(Constants.PAGODA_SESSION, login);
			
			LOGGER.debug("[" + request.getSession().getId() + "] login userid : " + user.getId());
			loginSuccess = true;
		}

		return loginSuccess;
	}
	
	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, User user) throws Exception {
		// TODO Auto-generated method stub
		
		user = (User) request.getSession().getAttribute(Constants.PAGODA_SESSION);
		if( user != null ){
			LOGGER.debug("[" + request.getSession().getId() + "] logout userid : " + user.getId());
			request.getSession().removeAttribute(Constants.PAGODA_SESSION);
			request.getSession().invalidate();
			
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			response.sendRedirect(request.getContextPath());
		}
		
	}

	@Override
	@Cacheable(value = "FRONT:CACHE:TEST1", key = "#user.toKeyString()")
	public String ehcacheTest1(HttpServletRequest request, User user) {
		LOGGER.info(" >> ehcacheTest 1 start..");
		return "ehcacheTest1";
	}
	
	@Override
	@Cacheable(value = "FRONT:CACHE:TEST2", key = "#user.toKeyString()")
	public String ehcacheTest2(HttpServletRequest request, User user) {
		LOGGER.info(" >> ehcacheTest 2 start..");
		return "ehcacheTest2";
	}
	
	@Override
	@Cacheable(value = "FRONT:CACHE:TEST3", key = "#user.toKeyString()")
	public String ehcacheTest3(HttpServletRequest request, User user) {
		LOGGER.info(" >> ehcacheTest 3 start..");
		return "ehcacheTest3";
	}
	
	@Override
	@CacheEvict(value = {"FRONT:CACHE:TEST1","FRONT:CACHE:TEST2","FRONT:CACHE:TEST3"}, allEntries = true)
	public void clearEhcache() {
		// TODO Auto-generated method stub
		LOGGER.info("clearCache");
	}

}
