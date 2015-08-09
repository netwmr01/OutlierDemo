package controllers;

import java.util.GregorianCalendar;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


/**
 * setup the resources folder mapping for the 
 * @author Hui Zheng
 *
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = { "controllers" })
public class WebConfig extends WebMvcConfigurerAdapter{
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	   registry.addResourceHandler("/resources/**").addResourceLocations("/resources/").setCachePeriod(31556926);
	   System.out.println(GregorianCalendar.getInstance().getTime() + "ResourcesHandeler Registry Finished.");
	}

}
