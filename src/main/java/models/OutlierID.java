package models;

import java.math.BigInteger;

/**
 * OutlierID object model
 * @author Tommzy
 *
 */
public class OutlierID{
	public String id;

	public OutlierID(String id){
		this.id=id;
	}
	
	public OutlierID() {
	}

	public String getID() {
		return id;
	}

	public boolean equals(Object other) {
		if (other instanceof OutlierID) {
			OutlierID otherID = (OutlierID)other;
			return (this.id.equals(otherID.id));
		} else {
			return false;
		}
	}
	public int hashCode() {
		return BigInteger.valueOf(Long.valueOf(this.id)).hashCode();
	}

	
}
