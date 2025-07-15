package com.webads.web_ads_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class WebAdsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebAdsBackendApplication.class, args);
	}

}
