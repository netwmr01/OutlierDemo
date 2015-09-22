angular.module('indexApp').factory('getConstLiers',
		['$http','$rootScope', function($http,$rootScope){

	return{
		// gets constant liers and colors the points
		update: function updateMethod(kmin,kmax,rmin,rmax){
			console.log("Starting ConstLiers get request");
			if(kmin===kmax && rmin===rmax){
				var empty = [[],[]];
            	$rootScope.$broadcast('redrawConstLiers',{data:empty});
			}else{
		        $http.get('/getConstants?kmin='+kmin+'&kmax='+kmax+'&rmin='+rmin+'&rmax='+rmax)
		        .success(function(data){
		        	console.log("ConstLiers request success");
	            	$rootScope.$broadcast('redrawConstLiers',{data:data});
		        })
		        .error(function(data){
	                console.log("Fail getting constant liers data");
		    	});
			}
 	   	}
	}
}]);