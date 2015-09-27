package models;

public class SimpleMapNode implements SimpleData{
	public String id;
	public double lat;
	public double lon;
	public SimpleMapNode(String id, double lat, double lon){
		this.id=id;
		this.lat=lat;
		this.lon=lon;
	}
	
	public SimpleMapNode(){
		
	}
}
