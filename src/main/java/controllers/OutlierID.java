package controllers;

public class OutlierID {
	final int id;

	public OutlierID(int id){
		this.id=id;
	}

	public int getID() {
		return id;
	}

	public boolean equals(Object other) {
		if (other instanceof OutlierID) {
			OutlierID otherID = (OutlierID)other;
			return (this.id == otherID.id);
		} else {
			return false;
		}
	}

}
