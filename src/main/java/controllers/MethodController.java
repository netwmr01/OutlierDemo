package controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import demo.dsrg.cs.wpi.edu.*;
import util.dsrg.cs.wpi.edu.SortedCandidate;

@RestController
public class MethodController {
	UserStudy userStudy;
	
	public MethodController(){
		userStudy = new UserStudy();
	}

	@RequestMapping("/methods")
	public Data greeting(@RequestParam(value="number", defaultValue="1") String number) {
		return new Data(number);
	}

	@RequestMapping("/method1")
	public @ResponseBody Collection<SortedCandidate> getMethod1(@RequestParam(value="k") String k, @RequestParam(value="r") String r){
		int intk=Integer.valueOf(k);
		System.out.println(k);
		double doubler=Double.valueOf(r);
		System.out.println(r);
		Collection<SortedCandidate> result = userStudy.getMethod1(intk, doubler);
		return result;
	}
	
	@RequestMapping("/getInitData")
	public @ResponseBody ArrayList<ArrayList<SortedCandidate>> getAllPoints(){
		return userStudy.getDataPlane();
	}

}
