package com.pagoda.transcoder.web.login.model;

import java.io.Serializable;

import com.pagoda.common.model.PagodaSession;
import com.pagoda.framework.core.persistence.dao.page.PagenateInfo;
import com.pagoda.framework.core.persistence.dao.page.Pagenateable;

public class User implements PagodaSession, Serializable, Pagenateable{
	private static final long serialVersionUID = 1L;
	
	private String id;
	private String passwd;
	private String name;
	private String email;
	private String phone;
	private String level;
	private String regDate;
	private String updDate;
	private String regDateYMD;
	private String updDateYMD;
	
	/**
	 * paging.
	 */
	private PagenateInfo page = new PagenateInfo();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPasswd() {
		return passwd;
	}
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getRegDate() {
		return regDate;
	}
	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}
	public String getUpdDate() {
		return updDate;
	}
	public void setUpdDate(String updDate) {
		this.updDate = updDate;
	}
	public String getRegDateYMD() {
		return regDateYMD;
	}
	public void setRegDateYMD(String regDateYMD) {
		this.regDateYMD = regDateYMD;
	}
	public String getUpdDateYMD() {
		return updDateYMD;
	}
	public void setUpdDateYMD(String updDateYMD) {
		this.updDateYMD = updDateYMD;
	}
	@Override
	public PagenateInfo getPage() {
		return this.page;
	}

	@Override
	public void setPage(PagenateInfo page) {
		this.page = page;
	}
	
	public String toKeyString() {
		String key = this.id + ":" + this.passwd + ":" + this.name + ":" + this.email + ":" + this.phone + ":" + this.level
				 + ":" + this.regDate + ":" + this.updDate + ":" + this.regDateYMD + ":" + this.updDateYMD;
		return key;
	}
}
