angular.module('indexApp').factory('getConstLiers',
		['$http','$rootScope', function($http,$rootScope){

	return{
		// gets const liers and colors the points
		update: function updateMethod(kmin,kmax,rmin,rmax){
			console.log("Starting ConstLiers get request");
	        $http.get('http://localhost:8080/getConstants?kmin='+
	                        kmin+'&kmax='+kmax+'&rmin='+rmin+'&rmax='+rmax)
	        .success(function(data){
	        	console.log("ConstLiers request success");
            	$rootScope.$broadcast('redrawConstLiers',{data:data});
	        })
	        .error(function(data){
                console.log("Fail getting constant liers data");
	    	});
 	   	}
	}
}]);