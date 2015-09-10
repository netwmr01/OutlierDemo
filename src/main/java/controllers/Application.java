package controllers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

/** 
 * The main function of the application
 * @author Hui Zheng
 * 
 */
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }
	
    /** 
     * main function
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        
    }
    
    
    
}
