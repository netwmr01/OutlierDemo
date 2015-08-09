package controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * View controller to handle request mapping for view change
 * @author Hui Zheng
 *
 */
@Controller
public class ViewController {

	/**
	 * Return the initial to the client
	 * @param name not required, test for parameter change
	 * @return
	 */
	@RequestMapping("/")
	public String indexView(@RequestParam(value="name",required=false, defaultValue="World") String name) {
		return "index";
	}
}
