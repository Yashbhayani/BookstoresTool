package com.bookstore.bookstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@SpringBootApplication
@ComponentScan(basePackages = {"com.bookstore.bookstore.Controller"})
public class BookstoreApplication implements WebMvcConfigurer {
	private final static Logger logger = LoggerFactory.getLogger(BookstoreApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BookstoreApplication.class, args);
		/*String url = "jdbc:mysql://localhost:3308/bookstore?useSSL=false";
		String user = "root";
		String password = "9974143053";

		try (Connection connection = DriverManager.getConnection(url, user, password)) {
			System.out.println("""
                    Connection to the database established successfully.""");
		} catch (SQLException e) {
			e.printStackTrace();
		}*/
		System.out.println("Hii");
	}

	@RequestMapping(value = "/error")
	public String error() {
		return "Error handling";
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("*") // allow all origins
				.allowedMethods("*") // allow all HTTP methods
				.allowedHeaders("*"); // allow all headers

	}




}
