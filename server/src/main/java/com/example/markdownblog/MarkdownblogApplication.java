package com.example.markdownblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.nio.charset.StandardCharsets;
import java.nio.charset.Charset;
import java.util.Locale;
import java.util.TimeZone;

@SpringBootApplication
public class MarkdownblogApplication {

	public static void main(String[] args) {
		// 시스템 인코딩 설정 강제
		System.setProperty("file.encoding", "UTF-8");
		System.setProperty("user.language", "ko");
		System.setProperty("user.country", "KR");
		System.setProperty("user.timezone", "Asia/Seoul");
		
		// 로케일 및 타임존 설정
		Locale.setDefault(new Locale("ko", "KR"));
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
		
		// 인코딩 설정 로깅
		System.out.println("System file.encoding: " + System.getProperty("file.encoding"));
		System.out.println("Default charset: " + Charset.defaultCharset());
		System.out.println("Default locale: " + Locale.getDefault());
		System.out.println("Default timezone: " + TimeZone.getDefault());
		
		SpringApplication.run(MarkdownblogApplication.class, args);
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
					.allowedOrigins("*")
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
					.allowedHeaders("*")
					.allowCredentials(false)
					.maxAge(3600);
			}
		};
	}
}
