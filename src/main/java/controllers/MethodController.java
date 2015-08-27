package controllers;


import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import demo.dsrg.cs.wpi.edu.*;
import detection.dsrg.cs.wpi.edu.KSortedDataPlain;
import models.OutlierID;
import models.RCandidates;
import models.SimpleData;
import models.SimpleMapNode;
import models.SimplePair;
import openmap.dsrg.cs.wpi.edu.MapNode;
import openmap.dsrg.cs.wpi.edu.MapOutlierCandidate;
import util.dsrg.cs.wpi.edu.DominationManager;
import util.dsrg.cs.wpi.edu.Pair;
import util.dsrg.cs.wpi.edu.SortedCandidate;
import org.apache.commons.io.FilenameUtils;

/** 
 * get http request from front-end and return computed dataset
 * @author Hui Zheng
 * 
 */
@RestController
public class MethodController {
	DominationManager dm;
	UserStudy userStudy;//get the instance of the userStudy interface 
	ArrayList<OutlierID> idDataPlane = new ArrayList<OutlierID>();//instantialize the dataplane at the beginning of the webapp starts
	HashSet<OutlierID> constantSet = new HashSet<OutlierID>();//Put the result of the constant outlier into a hashset, then use it as an dictionary to check later current outlier detecting.  
	ArrayList<OutlierID> outlierCandidates = new ArrayList<OutlierID>();// after the user select the region then, store the outlier candidates in this set
	String dataFile = "ocMitreDemo.txt";
	String rootPath="src/main/resources/data";

	/**
	 * Instantiate the ONION Engine:userStudy
	 * load the id DataPlane at the beginning for Constant/Current Outlier detection
	 */
	public MethodController(){
		dataFile=rootPath+File.separator+dataFile;
		userStudy = new UserStudy(dataFile);
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
	
	@RequestMapping("/getDataPlane")
	public @ResponseBody Set<MapOutlierCandidate> getDataPlane(@RequestParam(value="filename") String filename){
		String foldername = FilenameUtils.removeExtension(filename);
		dataFile=rootPath+File.separator+foldername+File.separator+filename;

		System.out.println("The path of the datafile:"+dataFile);
		userStudy = new UserStudy(dataFile);
		idDataPlane=getIdDataPlane();
		return userStudy.getPoints();
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
		Collection<SortedCandidate> rawConstantOutlier = userStudy.getMethod1(kMin, rMax);

		//get raw data of constant inlier, 
		//then get difference of the outlier with the whole data plane
		Collection<SortedCandidate> rawConstantInlier = userStudy.getMethod1(kMax, rMin);

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

	
	@RequestMapping("/getComparativeOutliers")
	public @ResponseBody HashMap<String,HashSet<OutlierID>> getComparativeOutliers(
			@RequestParam(value="id",required= true) String id,
			@RequestParam(value="kmin",required = false) String kmin,
			@RequestParam(value="kmax", required = false) String kmax){
		HashMap<String,HashSet<OutlierID>> result = new HashMap<String, HashSet<OutlierID>>();
		
		int kMin = kmin==null? 0 : Integer.valueOf(kmin);
		int kMax = kmax==null? 9 : Integer.valueOf(kmax); 
		ArrayList<List<SortedCandidate>> rawCoResult = new ArrayList<List<SortedCandidate>>();
		rawCoResult.addAll(userStudy.getMethod2(id));
		int counter=0;
		for(List<SortedCandidate> s: rawCoResult){
			if(!(counter>=kMin&&counter<=kMax)){
				break;
			}
			
			String tag = "k"+counter;
			HashSet<OutlierID> set = new HashSet<OutlierID>();
			for(SortedCandidate sc:s){
				set.add(new OutlierID(Integer.valueOf(((MapNode) sc.getPoint()).getID())));
			}
			result.put(tag, set);
			counter++;
		}
		return result;
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
	public @ResponseBody HashMap<String,ArrayList<Integer>> getDominationGroups(){



		DominationManager dm=null;
		try{
			dm = DominationManager.getInstance(dataFile);

		}catch(Exception e){
			System.out.println(e);
		}


		int i;
		HashMap<String,ArrayList<Integer>> hashMap= new HashMap<String,ArrayList<Integer>>();
		for (i=1;i<=3;i++){
			Set set = null;
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
			hashMap.put(lable, list);
		}

		return hashMap;
	}


	@RequestMapping("/getAllNodes")
	public @ResponseBody ArrayList<SimpleMapNode> getAllNodes(){
		ArrayList<SimpleMapNode> nodes= new ArrayList<SimpleMapNode>();

		DominationManager dm=null;
		try{
			dm = DominationManager.getInstance(dataFile);

		}catch(Exception e){
			System.out.println(e);
		}

		Iterator<MapOutlierCandidate> nodes_ite = null;
		try {
			nodes_ite = dm.getVertexSet().iterator();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		while(nodes_ite.hasNext()){
			MapNode mn = (MapNode) nodes_ite.next().getPoint();
			SimpleMapNode smn = new SimpleMapNode(Integer.valueOf(mn.getID()), mn.getLat(), mn.getLon());
			nodes.add(smn);
		}
		return nodes;
	}

	@RequestMapping("/getAllEdges")
	public @ResponseBody ArrayList<SimplePair> getAllEdges(){

		DominationManager dm=null;
		try{
			dm = DominationManager.getInstance(dataFile);

		}catch(Exception e){
			System.out.println(e);
		}

		ArrayList<SimplePair> edges = new ArrayList<SimplePair>();
		Iterator<Pair> edges_ite = dm.getAllEdges().iterator();
		while(edges_ite.hasNext()){
			Pair pair = edges_ite.next();
			SimplePair simplepair = new SimplePair(Integer.valueOf(pair.s.n.getID()),Integer.valueOf(pair.t.n.getID()));
			edges.add(simplepair);
		}
		return edges;
	}

	@RequestMapping("/getGraph")
	public @ResponseBody HashMap<String,ArrayList<SimpleData>> getGraph(){

		HashMap<String,ArrayList<SimpleData>> hm = new HashMap<String,ArrayList<SimpleData>>();
		ArrayList<SimpleData> nodes= new ArrayList<SimpleData>();
		ArrayList<SimpleData> edges= new ArrayList<SimpleData>();

		//instantiate the DominationManager to start initialize the graph
		DominationManager dm=null;
		try{
			dm = DominationManager.getInstance(dataFile);

		}catch(Exception e){
			System.out.println(e);
		}

		//get
		Iterator<MapOutlierCandidate> nodes_ite = null;
		try {
			nodes_ite =dm.getVertexSet().iterator();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		while(nodes_ite.hasNext()){
			MapNode mn = (MapNode) nodes_ite.next().getPoint();
			SimpleData smn = new SimpleMapNode(Integer.valueOf(mn.getID()), mn.getLat(), mn.getLon());
			nodes.add(smn);
		}
		hm.put("nodes", nodes);

		Iterator<Pair> edges_ite = dm.getAllEdges().iterator();
		while(edges_ite.hasNext()){
			Pair pair = edges_ite.next();
			SimpleData simplepair = new SimplePair(Integer.valueOf(pair.s.n.getID()),Integer.valueOf(pair.t.n.getID()));
			edges.add(simplepair);
		}
		hm.put("links", edges);
		return hm;
	}

	@RequestMapping("/getNonDominatePoints")
	public @ResponseBody HashSet<OutlierID> getNonDominatePoints(){

		//instantiate the DominationManager to start initialize the graph
		HashSet<OutlierID> hs = new HashSet<OutlierID>();
		DominationManager dm=null;
		try{
			dm = DominationManager.getInstance(dataFile);

		}catch(Exception e){
			System.out.println(e);
		}

		Iterator<MapOutlierCandidate> ite = dm.getNonDominatePoints().iterator();
		while(ite.hasNext()){
			hs.add(new OutlierID(Integer.valueOf(ite.next().n.getID())));
		}

		return hs;
	}

	@RequestMapping("/getGroup")
	public @ResponseBody LinkedHashMap<String, HashSet<OutlierID>> getGroup(@RequestParam(value="groupnumber")  String groupnumber){

		return getGroups(groupnumber);
	}
	
	
	public LinkedHashMap<String, HashSet<OutlierID>> getGroups(String groupnumber){
		//instantiate the DominationManager to start initialize the graph


		try{
			dm = DominationManager.getInstance(dataFile);

		}catch(Exception e){
			System.out.println(e);
		}
		int gn= Integer.valueOf(groupnumber);
		ArrayList<Integer> index_list = new ArrayList<Integer>();
		char[] numbers = groupnumber.toCharArray();
		for (char c : numbers)
		{
			index_list.add(Integer.valueOf(Character.toString(c)));
		}
		
		int groupNumber = 0; 
		Iterator<MapOutlierCandidate> mocIte = null;
		Iterator<Integer> ite = index_list.iterator();
		LinkedHashMap<String,HashSet<OutlierID>> hm = new LinkedHashMap<String,HashSet<OutlierID>>();

		while(ite.hasNext()){
			HashSet<OutlierID> hs = new HashSet<OutlierID>();
			groupNumber=ite.next();
			System.out.println("The index is: "+groupNumber);
			switch(groupNumber){
			case 0:
				mocIte = dm.getNonDominatePoints().iterator();
				break;
			case 1:
				try {
					mocIte = dm.getGroup1().iterator();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				break;
			case 2:
				try {
					mocIte = dm.getGroup2().iterator();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				break;
			case 3:
				try {
					mocIte = dm.getGroup3().iterator();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			while(mocIte.hasNext()){
				hs.add(new OutlierID(Integer.valueOf(mocIte.next().n.getID())));
			}
			String key="group"+groupNumber;
			hm.put(key,hs);
		}
		
		return hm;
	}

	
	@RequestMapping("/preComputeAllFiles")
	public int preComputeAllFiles(){
		String originalFileName= dataFile;
		String originalRootPath = rootPath;
		int fileNumber=0;
		File directory = new File(rootPath);
		File[] fList = directory.listFiles();
		for(final File f: fList){
			if(f.isDirectory()){
				File[] files = f.listFiles();
				int i;
				File dir;
				File df;
				
				FileFilter filter =new FileFilter(){
					public boolean accept(File file){
							return file.getName().startsWith(f.getName());							
					}
				};
				File[] result = f.listFiles(filter);
				rootPath = f.getPath();
				System.out.println("The rootPath changed to: "+rootPath);
				if(result.length!=0)
					dataFile = f.listFiles(filter)[0].getAbsolutePath();
				System.out.println("About to Pre Compute: "+ dataFile);
				

				
				for(i=0;i<4;i++){//check whether the gourp 0-3 files exists
					dir=new File(rootPath);
					df = new File(dir.getAbsolutePath()
							+ File.separator + "group"+i+".json");
					if(!df.exists()){
						ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
						String json = null;

						try {
							json = ow.writeValueAsString(getGroups(String.valueOf(i)));
							BufferedOutputStream stream =
									new BufferedOutputStream(new FileOutputStream(df));
							stream.write(json.getBytes());
							stream.close();
						} catch (FileNotFoundException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (JsonProcessingException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
				}
				fileNumber++;
			}
		}
		dataFile = originalFileName;
		rootPath = originalRootPath; 
		return fileNumber;
	}

}
