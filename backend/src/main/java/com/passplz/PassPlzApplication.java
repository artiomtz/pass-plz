package com.passplz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.passplz" })
public class PassPlzApplication {

	public static void main(String[] args) {
		SpringApplication.run(PassPlzApplication.class, args);
	}

}
