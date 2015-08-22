package models;

public class SimpleMapNode implements SimpleData{
	public int id;
	public double lat;
	public double lon;
	public SimpleMapNode(int id, double lat, double lon){
		this.id=id;
		this.lat=lat;
		this.lon=lon;
	}
}
