package models;

import java.util.ArrayList;

public class KSList {
	public int kValue;
	public ArrayList<RCandidates> klist;
	
	public KSList(int kValue){
		this.kValue=kValue;
		klist = new ArrayList<RCandidates>();
	}

}
