package com.pagoda.transcoder.web.transcoder.model;

public class TranscoderFile {
	
	private String resolution;
	private String videoCodec;
	private String videoBitRate;
	private String audioCodec;
	private String audioBitRate;
	
	public String getResolution() {
		return resolution;
	}
	public void setResolution(String resolution) {
		this.resolution = resolution;
	}
	public String getVideoCodec() {
		return videoCodec;
	}
	public void setVideoCodec(String videoCodec) {
		this.videoCodec = videoCodec;
	}
	public String getVideoBitRate() {
		return videoBitRate;
	}
	public void setVideoBitRate(String videoBitRate) {
		this.videoBitRate = videoBitRate;
	}
	public String getAudioCodec() {
		return audioCodec;
	}
	public void setAudioCodec(String audioCodec) {
		this.audioCodec = audioCodec;
	}
	public String getAudioBitRate() {
		return audioBitRate;
	}
	public void setAudioBitRate(String audioBitRate) {
		this.audioBitRate = audioBitRate;
	}
	
}
