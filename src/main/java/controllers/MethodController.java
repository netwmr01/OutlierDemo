package controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import demo.dsrg.cs.wpi.edu.*;
import util.dsrg.cs.wpi.edu.SortedCandidate;

@RestController
public class MethodController {

	@RequestMapping("/methods")
	public Data greeting(@RequestParam(value="number", defaultValue="1") String number) {
		return new Data(number);
	}

	@RequestMapping("/method1")
	public String getMethod1(@RequestParam Map<String,String> requestParams){
		int k=Integer.valueOf(requestParams.get("k"));
		System.out.println(k);
		double r=Double.valueOf(requestParams.get("r"));
		System.out.println(r);
		UserStudy userStudy = new UserStudy();
		Collection<SortedCandidate> result = userStudy.getMethod1(k, r);
		return result.toArray().toString();
	}

}
