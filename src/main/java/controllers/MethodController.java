package controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import demo.dsrg.cs.wpi.edu.*;
import demo.dsrg.cs.wpi.edu.UserStudy.DataResult;
import detection.dsrg.cs.wpi.edu.KSortedDataPlain;
import models.KSList;
import models.OutlierID;
import models.RCandidates;
import openmap.dsrg.cs.wpi.edu.MapNode;
import openmap.dsrg.cs.wpi.edu.MapOutlierCandidate;
import util.dsrg.cs.wpi.edu.SortedCandidate;

@RestController
public class MethodController {
	UserStudy userStudy;
	ArrayList<OutlierID> idDataPlane = new ArrayList<OutlierID>();
	HashSet<OutlierID> constantSet = new HashSet<OutlierID>();
	ArrayList<OutlierID> outlierCandidates = new ArrayList<OutlierID>();

	public MethodController(){
		userStudy = new UserStudy();
		idDataPlane=getIdDataPlane();
	}
	

	public ArrayList<OutlierID> getIdDataPlane(){
		ArrayList<OutlierID> idDataPlane = new ArrayList<OutlierID>();

		Iterator ite = userStudy.getPoints().iterator();
		while(ite.hasNext()){
			MapOutlierCandidate oc = (MapOutlierCandidate) ite.next();
			idDataPlane.add(new OutlierID(Integer.valueOf(((MapNode)(oc.getPoint())).getID())));
		}
		return idDataPlane;

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



	@RequestMapping("/getConstants")
	public @ResponseBody ArrayList getOSpace(@RequestParam(value="kmin") String kmin, 
			@RequestParam(value="kmax") String kmax,
			@RequestParam(value="rmin") String rmin,
			@RequestParam(value="rmax") String rmax){


		int kMin=Integer.valueOf(kmin);
		int kMax=Integer.valueOf(kmax);
		double rMin=Double.valueOf(rmin);
		double rMax=Double.valueOf(rmax);

		System.out.println("K: "+kMin+"~"+kMax);
		System.out.println("r: "+rMin+"~"+rMax);
		Collection<SortedCandidate> rawConstantOutlier = userStudy.getMethod1(kMin, rMax);
		Collection<SortedCandidate> rawConstantInlier = userStudy.getMethod1(kMax, rMin);

		Collection<OutlierID> constantOutlier = new ArrayList<OutlierID>();
		ArrayList<OutlierID> minOutliers = new ArrayList<OutlierID>();
		Collection<OutlierID> constantInlier = new ArrayList<OutlierID>();

		Iterator iteCO = rawConstantOutlier.iterator();
		Iterator iteCI = rawConstantInlier.iterator();
		while(iteCO.hasNext()){
			SortedCandidate data = (SortedCandidate) iteCO.next();
			String id = (String)((MapNode) data.getPoint()).getID();
			constantOutlier.add(new OutlierID(Integer.valueOf(id)));
		}
		while(iteCI.hasNext()){
			SortedCandidate data= (SortedCandidate) iteCI.next();
			String id = (String)((MapNode) data.getPoint()).getID();
			minOutliers.add(new OutlierID(Integer.valueOf(id)));
		}
		
		constantInlier.addAll(idDataPlane);
		constantInlier.removeAll(minOutliers);
		

		System.out.println("CO Size:"+ constantOutlier.size());
		System.out.println("CI Size:"+ constantInlier.size());
		System.out.println("MO Size: "+minOutliers.size());

		ArrayList<Collection<OutlierID>> results = new ArrayList<Collection<OutlierID>>();
		results.add(constantOutlier);
		results.add(constantInlier);
		
		constantSet.addAll(constantOutlier);
		
		outlierCandidates.addAll(idDataPlane);
		outlierCandidates.removeAll(constantInlier);
		outlierCandidates.removeAll(constantOutlier);
		
		System.out.println("Outlier Candidates #: "+outlierCandidates.size());
		

		return results;
	}
	
	@RequestMapping("/getCurrentOutliers")
	public @ResponseBody ArrayList getCurrentOutliers(@RequestParam(value="kvalue") String kvalue, 
			@RequestParam(value="rvalue") String rvalue){
		int k=Integer.valueOf(kvalue);
		int r=Integer.valueOf(rvalue);
		
		Collection<SortedCandidate> rawConstantOutlier = userStudy.getMethod1(k, r);

		Collection<OutlierID> currentOutliers = new ArrayList<OutlierID>();
		Collection<OutlierID> currentInliers = new ArrayList<OutlierID>();

		Iterator iteCCO = rawConstantOutlier.iterator();
		
		while(iteCCO.hasNext()){
			SortedCandidate data = (SortedCandidate) iteCCO.next();
			int id = Integer.valueOf((String)((MapNode) data.getPoint()).getID());
			OutlierID candidate = new OutlierID(id);
			if(constantSet.contains(candidate)){
				continue;
			}
			currentOutliers.add(candidate);
		}
		
		currentInliers.addAll(outlierCandidates);
		currentInliers.removeAll(currentOutliers);
		
		
		ArrayList<Collection<OutlierID>> results = new ArrayList<Collection<OutlierID>>();
		results.add(currentOutliers);
		results.add(currentInliers);
		
		System.out.println("Outlier Candidates #: "+outlierCandidates.size());
		System.out.println("Current Outliers #: "+currentOutliers.size());
		System.out.println("Current Inliers#: "+currentInliers.size());
		
		
		
		return results;
	}
	
	@RequestMapping("/getKSortedList")
	public @ResponseBody ArrayList getKSortedList(){
		
		KSortedDataPlain kSortedDataPlain = userStudy.getKSortedList();
		ArrayList<ArrayList<SortedCandidate>> rawdp = kSortedDataPlain.getEntireSpace();
		
		System.out.println("rawdp size: "+rawdp.size());
		
		Iterator ite = rawdp.iterator();
		ArrayList<KSList> dp = new ArrayList<KSList>();
		int counter = 0;
		while(ite.hasNext()){
			KSList kslist = new KSList(counter);
			ArrayList<SortedCandidate> sortedCandidateList=(ArrayList<SortedCandidate>) ite.next();
			Iterator scite = sortedCandidateList.iterator();
			while(scite.hasNext()){
				SortedCandidate sc = (SortedCandidate) scite.next();
				RCandidates rcandidates = new RCandidates(sc.r,Integer.valueOf(((MapNode)sc.getPoint()).getID()));
				kslist.klist.add(rcandidates);
			}
			dp.add(kslist);
			counter++;
		}
		
		return dp;
		
	}
	
	@RequestMapping("/getKSortedListRange")
	public @ResponseBody ArrayList<KSList> getKSortedListRange(@RequestParam(value="kmin") String kmin, 
			@RequestParam(value="kmax") String kmax,
			@RequestParam(value="rmin") String rmin,
			@RequestParam(value="rmax") String rmax){
		
		System.out.println("getKSortedListRange Get Called!");
		
		KSortedDataPlain kSortedDataPlain = userStudy.getKSortedList();
		ArrayList<ArrayList<SortedCandidate>> rawdp = kSortedDataPlain.getEntireSpace();
		
		Iterator<ArrayList<SortedCandidate>> ite = rawdp.iterator();
		ArrayList<KSList> dp = new ArrayList<KSList>();
		int kcounter = 0;
		while(ite.hasNext()){
			if(kcounter<Integer.valueOf(kmin) ){
				kcounter++;
				continue;
			}else if(kcounter >Integer.valueOf(kmax)){
				break;
			}
			System.out.println("getKSortedListRange Working !");
			KSList kslist = new KSList(kcounter);
			ArrayList<SortedCandidate> sortedCandidateList=(ArrayList<SortedCandidate>) ite.next();
			Iterator scite = sortedCandidateList.iterator();
			while(scite.hasNext()){
				SortedCandidate sc = (SortedCandidate) scite.next();
				if(sc.r<Double.valueOf(rmin)||sc.r>Double.valueOf(rmax)){
					continue;
				}
				RCandidates rcandidates = new RCandidates(sc.r,Integer.valueOf(((MapNode)sc.getPoint()).getID()));
				kslist.klist.add(rcandidates);
			}
			boolean success = dp.add(kslist);
			System.out.println("Add success or not: "+success);
			kcounter++;
			
			System.out.println("Looping");
		}
		
		System.out.println("getKSortedListRange Finished!");
		
		return dp;
		
	}
	
	
	


}
