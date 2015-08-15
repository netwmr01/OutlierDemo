package controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
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
import util.dsrg.cs.wpi.edu.DominationManager;
import util.dsrg.cs.wpi.edu.GetVertexCover;
import util.dsrg.cs.wpi.edu.SortedCandidate;

/** get http request from front-end and return computed dataset
 * @author Hui Zheng
 * 
 */
@RestController
public class MethodController {
	
	UserStudy userStudy;//get the instance of the userStudy interface 
	ArrayList<OutlierID> idDataPlane = new ArrayList<OutlierID>();//instantialize the dataplane at the beginning of the webapp starts
	HashSet<OutlierID> constantSet = new HashSet<OutlierID>();//Put the result of the constant outlier into a hashset, then use it as an dictionary to check later current outlier detecting.  
	ArrayList<OutlierID> outlierCandidates = new ArrayList<OutlierID>();// after the user select the region then, store the outlier candidates in this set
	

	/**
	 * Instantiate the ONION Engine:userStudy
	 * load the id DataPlane at the beginning for Constant/Current Outlier detection
	 */
	public MethodController(){
		userStudy = new UserStudy();
		idDataPlane=getIdDataPlane();
	}
	

	/**
	 * Shrink MapOutlierCandidate to OutlierID object 
	 * @return
	 */
	public ArrayList<OutlierID> getIdDataPlane(){
		ArrayList<OutlierID> idDataPlane = new ArrayList<OutlierID>();

		Iterator<MapOutlierCandidate> ite = userStudy.getPoints().iterator();
		
		while(ite.hasNext()){
			MapOutlierCandidate oc = (MapOutlierCandidate) ite.next();
			idDataPlane.add(new OutlierID(Integer.valueOf(((MapNode)(oc.getPoint())).getID())));
		}
		return idDataPlane;

	}
	
	/**
	 * Request for method1, user can input k r value pair to get the Outliers
	 * @param k kvalue
	 * @param r rvalue 
	 * @return collection of OutlierID
	 */
	@RequestMapping("/method1")
	public @ResponseBody Collection<OutlierID> getMethod1(@RequestParam(value="k") String k, @RequestParam(value="r") String r){
		//translate the k and r value from string to int and double
		int intk=Integer.valueOf(k);
		System.out.println("K value getted"+k);
		double doubler=Double.valueOf(r);
		System.out.println("R value getted"+r);
		
		//get the raw data from the ONION engine
		Collection<SortedCandidate> rawResult = UserStudy.getMethod1(intk, doubler);
		//Instantiate another result set that only contains ID
		Collection<OutlierID> result = new ArrayList<OutlierID>(); 

		Iterator<SortedCandidate> ite = rawResult.iterator();
		while(ite.hasNext()){
			SortedCandidate data = (SortedCandidate) ite.next();
			String id = (String)((MapNode) data.getPoint()).getID();
			result.add(new OutlierID(Integer.valueOf(id)));
		}

		System.out.println(result.toString());

		return result;
	}


	/**
	 * This request will take an k r value range and return all 
	 * constants Outlier and Inlier in a Arraylist
	 * @param kmin 
	 * @param kmax
	 * @param rmin
	 * @param rmax
	 * @return ArrayList<Collection<OutlierID>> 
	 * This returned data structure has two element, 
	 * The first one is constantOutlier in an ArrayList<OutlierID>()
	 * The second one is constantInlier in an ArrayList<OutlierID>()
	 */
	@RequestMapping("/getConstants")
	public @ResponseBody ArrayList<Collection<OutlierID>> getOSpace(@RequestParam(value="kmin") String kmin, 
			@RequestParam(value="kmax") String kmax,
			@RequestParam(value="rmin") String rmin,
			@RequestParam(value="rmax") String rmax){

		
		//translate the k and r values from string to int and double
		int kMin=Integer.valueOf(kmin);
		int kMax=Integer.valueOf(kmax);
		double rMin=Double.valueOf(rmin);
		double rMax=Double.valueOf(rmax);

		//consule out the k & r value
		System.out.println("K: "+kMin+"~"+kMax);
		System.out.println("r: "+rMin+"~"+rMax);
		
		//get raw data of constant outlier
		Collection<SortedCandidate> rawConstantOutlier = UserStudy.getMethod1(kMin, rMax);
		
		//get raw data of constant inlier, 
		//then get difference of the outlier with the whole data plane
		Collection<SortedCandidate> rawConstantInlier = UserStudy.getMethod1(kMax, rMin);

		Collection<OutlierID> constantOutlier = new ArrayList<OutlierID>();
		ArrayList<OutlierID> minOutliers = new ArrayList<OutlierID>();
		Collection<OutlierID> constantInlier = new ArrayList<OutlierID>();

		Iterator<SortedCandidate> iteCO = rawConstantOutlier.iterator();
		Iterator<SortedCandidate> iteCI = rawConstantInlier.iterator();
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
	
	
	/**
	 * return the current outliers after the user choose the k r value range
	 * AND pick up a k r value pair in the range rectangle 
	 * @param kvalue
	 * @param rvalue
	 * @return ArrayList<Collection<OutlierID>>
	 */
	@RequestMapping("/getCurrentOutliers")
	public @ResponseBody ArrayList<Collection<OutlierID>> getCurrentOutliers(@RequestParam(value="kvalue") String kvalue, 
			@RequestParam(value="rvalue") String rvalue){
		int k=Integer.valueOf(kvalue);
		int r=Integer.valueOf(rvalue);
		
		//get raw data
		Collection<SortedCandidate> rawConstantOutlier = UserStudy.getMethod1(k, r);

		Collection<OutlierID> currentOutliers = new ArrayList<OutlierID>();
		Collection<OutlierID> currentInliers = new ArrayList<OutlierID>();

		Iterator<SortedCandidate> iteCCO = rawConstantOutlier.iterator();
		
		//iterate the data set and find it contains in constant outlier hashset or not
		//to determine whether it contains of this element is current outlier or not
		//time complicity O(n)
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
	
	/**
	 * This request function will return ALL of the ksortedlist
	 * 
	 * @return ArrayList<KSList> an 10 element array start with 0
	 *  
	 */
	@RequestMapping("/getKSortedList")
	public @ResponseBody HashMap<String,ArrayList<RCandidates>> getKSortedList(){
		
		//get raw data
		KSortedDataPlain kSortedDataPlain = userStudy.getKSortedList();
		ArrayList<ArrayList<SortedCandidate>> rawdp = kSortedDataPlain.getEntireSpace();
		HashMap<String,ArrayList<RCandidates>> dp = new HashMap<String,ArrayList<RCandidates>>();
		System.out.println("rawdp size: "+rawdp.size());
		
		Iterator<ArrayList<SortedCandidate>> ite = rawdp.iterator();
		int counter = 1;
		while(ite.hasNext()){
			String key = "k"+counter;
			System.out.println("key: "+ key);
			ArrayList<RCandidates> rlist = new ArrayList<RCandidates>();
			
			ArrayList<SortedCandidate> sortedCandidateList=(ArrayList<SortedCandidate>) ite.next();
			Iterator<SortedCandidate> scite = sortedCandidateList.iterator();
			while(scite.hasNext()){
				SortedCandidate sc = (SortedCandidate) scite.next();
				RCandidates rcandidates = new RCandidates(sc.r,Integer.valueOf(((MapNode)sc.getPoint()).getID()));
				rlist.add(rcandidates);
			}
			dp.put(key, rlist);
			counter++;
		}
		
		return dp;
		
	}
	

	/**
	 * given a specific range of k r range, get an 
	 * @param kmin
	 * @param kmax
	 * @param rmin
	 * @param rmax
	 * @return
	 */
	@RequestMapping("/getKSortedListRange")
	public @ResponseBody HashMap<String,ArrayList<RCandidates>> getKSortedListRange(@RequestParam(value="kmin") String kmin, 
			@RequestParam(value="kmax") String kmax,
			@RequestParam(value="rmin") String rmin,
			@RequestParam(value="rmax") String rmax){
		
		System.out.println("getKSortedListRange Get Called!");
		
		KSortedDataPlain kSortedDataPlain = userStudy.getKSortedList();
		ArrayList<ArrayList<SortedCandidate>> rawdp = kSortedDataPlain.getEntireSpace();
		
		Iterator<ArrayList<SortedCandidate>> ite = rawdp.iterator();
		HashMap<String,ArrayList<RCandidates>> dp = new HashMap<String,ArrayList<RCandidates>>();
		int kcounter = 1;
		while(ite.hasNext()){
			//get the range of the k&r value
			if(kcounter<Integer.valueOf(kmin) ){
				kcounter++;
				continue;
			}else if(kcounter >Integer.valueOf(kmax)){
				break;
			}
			System.out.println("getKSortedListRange Working !");
			String key = "k"+kcounter;
			System.out.println("key: "+ key);

			ArrayList<RCandidates> rlist = new ArrayList<RCandidates>();
			ArrayList<SortedCandidate> sortedCandidateList=(ArrayList<SortedCandidate>) ite.next();
			Iterator<SortedCandidate> scite = sortedCandidateList.iterator();
			while(scite.hasNext()){
				SortedCandidate sc = (SortedCandidate) scite.next();
				if(sc.r<Double.valueOf(rmin)){
					continue;
				}else if (sc.r>Double.valueOf(rmax)){
					break;
				}
				RCandidates rcandidates = new RCandidates(sc.r,Integer.valueOf(((MapNode)sc.getPoint()).getID()));
				rlist.add(rcandidates);
			}
			dp.put(key,rlist);
			kcounter++;
		}
		
		System.out.println("getKSortedListRange Finished!");
		
		return dp;
		
	}
	
	
	@RequestMapping("/getDominationGroups")
	public @ResponseBody ArrayList<HashMap<String,ArrayList<Integer>>> getDominationGroups(){
		String dataFile = "ocMitreDemo.txt";
		
		ArrayList<HashMap<String,ArrayList<Integer>>> result = new ArrayList<HashMap<String,ArrayList<Integer>>>();
		
		DominationManager dm=null;
		try{
			dm = DominationManager.getInstance();
			
		}catch(Exception e){
			System.out.println(e);
		}
		
		
		int i;
		for (i=1;i<=3;i++){
			List set = null;
			String lable = "Group"+i;
			ArrayList<Integer> list = new ArrayList<Integer>(); 
			try {
				switch(i){
					case 1: 
						set = dm.getGroup1();
						break;
					case 2:
						set = dm.getGroup2();
						break;
					case 3:
						set = dm.getGroup3();
						break;
				}
				
				Iterator ite =set.iterator();
				while(ite.hasNext()){
					MapOutlierCandidate moc= (MapOutlierCandidate) ite.next();
					list.add(Integer.valueOf(((MapNode) moc.getPoint()).getID()));
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			HashMap<String,ArrayList<Integer>> hashMap= new HashMap<String,ArrayList<Integer>>();
			hashMap.put(lable, list);
			result.add(hashMap);
		}
		
		return result;
	}
	
	
	


}
