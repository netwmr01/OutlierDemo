package controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ViewController {

	@RequestMapping("/")
	public String indexView(@RequestParam(value="name",required=false, defaultValue="World") String name) {
		return "index";
	}
	
	@RequestMapping("/test")
	public String indexView2(@RequestParam(value="name",required=false, defaultValue="World") String name) {
		return "hello";
	}

}
