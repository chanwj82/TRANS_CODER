package com.pagoda.transcoder.web.transcoder.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pagoda.common.ResponseData;
import com.pagoda.transcoder.trancoder.Transcoder;
import com.pagoda.transcoder.web.transcoder.service.TranscoderService;


@Controller
public class TranscoderController {

	private static final Logger LOGGER = LoggerFactory.getLogger(TranscoderController.class);

	@Autowired
	private TranscoderService transcoderService;

	@Value("#{properties['encode.source.path']}")
	private String encodeSourcePath;

	/**
	 * 트랜스코딩 실시간 변환 메인
	 * 
	 * @param model
	 *            Model
	 * @return main 페이지.
	 * @throws Exception
	 *             Exception
	 */
	@RequestMapping(value = { "/main" })
	public String main(HttpServletRequest request, @RequestParam Map<String, Object> commandMap, Model model)
			throws Exception {
		
		return "/main";
	}

	/**
	 * 트랜스코딩 실시간 변환 모니터링 리스트
	 * 
	 * @param model
	 *            Model
	 * @return list 페이지.
	 * @throws Exception
	 *             Exception
	 */
	@RequestMapping(value = { "/list" })
	public String list(HttpServletRequest request, @RequestParam Map<String, Object> commandMap, Model model)
			throws Exception {

		return "/list";
	}

	/**
	 * 트랜스코딩 전체 실시간 변환 모니터링 리스트
	 * 
	 * @param model
	 *            Model
	 * @return list 페이지.
	 * @throws Exception
	 *             Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = { "/monitoring" })
	public String list2(HttpServletRequest request, @RequestParam Map<String, Object> commandMap, Model model)
			throws Exception {

		Map<String, Object>[] queueJoblist = null;

		try {
			if (Transcoder.queue != null && Transcoder.queue.size() > 0) {
				LOGGER.debug("Transcoder.queue.size() = " + Transcoder.queue.size());
				queueJoblist = Transcoder.queue.toArray(new HashMap[0]);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		model.addAttribute("currentJob", Transcoder.currentJob);
		model.addAttribute("queueJoblist", queueJoblist);

		return "/monitoring";
	}

	

	
	/**
	 * Transcoder Queue job Thread ffmpeg command call ( Realtime Stream Upload. Do not use tempfile buffer ) 
	 * 
	 * @param model
	 *            Model
	 * @return 메인 페이지.
	 * @throws Exception
	 *             Exception
	 */
	@RequestMapping(value = { "/ajaxTranscoderStart5" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseData ajaxTranscoderStart5(HttpServletRequest request, ModelMap mv ) throws IOException {

		ResponseData result = new ResponseData();
		

		ServletFileUpload upload = new ServletFileUpload();
		FileItemIterator iter;

		try {
			iter = upload.getItemIterator(request);

			FileItemStream item = null;
			String name = "";
			String value = "";
			InputStream stream = null;
			
			HashMap<String, Object> commandMap = new HashMap<String,Object>();

			while (iter.hasNext()) {
				item = iter.next();
				name = item.getFieldName();
				stream = item.openStream();

				if(item.getContentType() == null){
					value = Streams.asString(stream);
					LOGGER.debug("fieldName [" + name + "] value [" + value + "] contentType [" + item.getContentType() + "]" );
					commandMap.put(name, value);
				}
				else if(item.getContentType() != null && item.getContentType().indexOf("video") >= 0) {
					String fileName = new File(item.getName()).getName();
					
					LOGGER.info("videoFileName [" + fileName + "]");
					
					String uuid = UUID.randomUUID().toString().replace("-", "");

					String fileExtSn = fileName.substring(fileName.lastIndexOf(".") + 1);

					// 신규파일네임 규약
					String todate = (new SimpleDateFormat("yyyyMMddHHmmss")).format(new java.util.Date());
					String newFileNm = todate + "_" + uuid;
					String sourceFilePath = encodeSourcePath + "/" + newFileNm;

					File encodeSourcePathDir = new File(encodeSourcePath);
					if(!encodeSourcePathDir.exists()){
						encodeSourcePathDir.mkdirs();
					}

					File file = new File(sourceFilePath + "." + fileExtSn);
					FileOutputStream fos = new FileOutputStream(file);

					long fileSize = Streams.copy(stream, fos, true);
					
					@SuppressWarnings("unchecked")
					HashMap<String, Object> mCommandMap = (HashMap<String, Object>) commandMap.clone();

					mCommandMap.put("sourceFilePath", sourceFilePath + "." + fileExtSn);
					mCommandMap.put("fileid", newFileNm);
					mCommandMap.put("filename", fileName);
					mCommandMap.put("fileSize", fileSize);

					transcoderService.transcoderStart3(request, mCommandMap);

				}
			}

			result.setResponseCode("0");
			result.setResponseMessage("success");

		} catch (Exception e) {
			e.printStackTrace();
			result.setResponseMessage((e.getMessage() == null ? "Exception Error" : e.getMessage()));
		}

		return result;
	}

}
