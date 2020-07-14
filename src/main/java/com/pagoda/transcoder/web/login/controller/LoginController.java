package com.pagoda.transcoder.web.login.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pagoda.common.Constants;
import com.pagoda.common.ResponseData;
import com.pagoda.transcoder.web.login.model.User;
import com.pagoda.transcoder.web.login.service.LoginService;

@Controller
public class LoginController {
	
	@SuppressWarnings("unused")
	private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private LoginService loginService;
	
	/**
	 * B2B 포팅 로그인 페이지
	 * 
	 * @param model
	 *            Model
	 * @return main 페이지.
	 * @throws Exception
	 *             Exception
	 */
	@RequestMapping(value = { "/login" })
	public String login(HttpServletRequest request, Model model) throws Exception {
		
		User user = (User) request.getSession().getAttribute(Constants.PAGODA_SESSION);

		if ( user != null ) return "/main";
		else return "/login";
		
	}
	
	
	/**
	 * B2B 포팅 로그인 처리 Ajax Request 
	 * 
	 * @param User loginSession
	 * @return ResponseBody ResponseData.
	 * @throws Exception
	 */
	@RequestMapping(value = { "/ajaxLogin" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseData ajaxLogin(HttpServletRequest request, User user) throws IOException {
		
		LOGGER.info("login start..");
		
		ResponseData response = new ResponseData();
		
		try{
			if( loginService.login(request, user) ){
				response.setResponseCode("0");
				response.setResponseMessage("success");
			}
			else{
				response.setResponseCode("-1");
				response.setResponseMessage("fail");
			}
		}catch(Exception e){
			e.printStackTrace();
			response.setResponseCode("202");
			response.setResponseMessage("error");
			response.setResponseMessage((e.getMessage() == null ? "Exception Error" : e.getMessage()));
		}
		
		LOGGER.info(loginService.ehcacheTest1(request, user));
		LOGGER.info(loginService.ehcacheTest2(request, user));
		LOGGER.info(loginService.ehcacheTest3(request, user));
		
		LOGGER.info("login end..");
		
		return response;
	}
	
	/**
	 * B2B 포팅 로그인 페이지
	 * 
	 * @param model
	 *            Model
	 * @return main 페이지.
	 * @throws Exception
	 *             Exception
	 */
	@RequestMapping(value = { "/logout" })
	public void logout(HttpServletRequest request, HttpServletResponse response, User user) throws Exception {
		loginService.logout(request, response, user);

	}
	
	@RequestMapping(value = { "/clearCache" })
	public void clearCache(HttpServletRequest request, HttpServletResponse response, User user) throws Exception {
		loginService.clearEhcache();
	}
}
