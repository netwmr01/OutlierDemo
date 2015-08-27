package models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class GroupResult {
	public String tag;
	public OutlierID[] set;
	
	public GroupResult(String tag, OutlierID[] set){
		this.tag=tag;
		this.set=set;
	}
	public GroupResult() {
    }

}
