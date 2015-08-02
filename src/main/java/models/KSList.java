package models;

import java.util.ArrayList;

/**
 * Shrinked ksortedlist
 * Contains k value and an array of RCandidates(r,id);
 * @author Tommzy
 *
 */
public class KSList {
	public int kValue;
	public ArrayList<RCandidates> klist;
	
	public KSList(int kValue){
		this.kValue=kValue;
		klist = new ArrayList<RCandidates>();
	}

}
