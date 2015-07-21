package controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import demo.dsrg.cs.wpi.edu.*;
import demo.dsrg.cs.wpi.edu.UserStudy.DataResult;
import openmap.dsrg.cs.wpi.edu.MapNode;
import openmap.dsrg.cs.wpi.edu.MapOutlierCandidate;
import util.dsrg.cs.wpi.edu.SortedCandidate;

@RestController
public class MethodController {
	UserStudy userStudy;
	
	public MethodController(){
		userStudy = new UserStudy();
	}

//	@RequestMapping("/methods")
//	public Data greeting(@RequestParam(value="number", defaultValue="1") String number) {
//		return new Data(number);
//	}

	@RequestMapping("/method1")
	public @ResponseBody Collection<OutlierID> getMethod1(@RequestParam(value="k") String k, @RequestParam(value="r") String r){
		int intk=Integer.valueOf(k);
		System.out.println(k);
		double doubler=Double.valueOf(r);
		System.out.println(r);
		Collection<SortedCandidate> rawResult = userStudy.getMethod1(intk, doubler);
		Collection<OutlierID> result = new ArrayList<OutlierID>(); 
		
		Iterator ite = rawResult.iterator();
		while(ite.hasNext()){
			SortedCandidate data = (SortedCandidate) ite.next();
			String id = (String)((MapNode) data.getPoint()).getID();
			result.add(new OutlierID(Integer.valueOf(id)));
		}
		
		System.out.println(result.toString());
		
		return result;
	}
	
	@RequestMapping("/method2")
	public void getMethod2(@RequestParam(value="id") String id){
		
	}
	
	@RequestMapping("/method3")
	public void getMethod3(){
		
	}
	
//	
//	@RequestMapping("/getDataPoints")
//	public @ResponseBody Set getDataPoints(){
//		Set dataPoints = new HashSet<MapOutlierCandidate>();
//		
//		Iterator ite = userStudy.getPoints().iterator();
//		while(ite.hasNext()){
//			MapOutlierCandidate oc = (MapOutlierCandidate) ite.next();
//			dataPoints.add(oc.getPoint());
//		}
//		return dataPoints;
//	}
	

}
