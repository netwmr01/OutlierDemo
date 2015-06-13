package controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MethodController {

    @RequestMapping("/methods")
    public Data greeting(@RequestParam(value="number", defaultValue="1") String number) {
    	return new Data(number);
    }
    
}
