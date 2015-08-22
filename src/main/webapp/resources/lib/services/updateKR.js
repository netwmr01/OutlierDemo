angular.module('indexApp').factory('updateKR',
    ['$http','$rootScope', function($http,$rootScope){

	kvalue=5;
    rvalue=5000;
    oldK=0;
    oldR=0;


    //sets the kr values
    setKR = function(k,r){
        oldK=kvalue;
        oldR=rvalue;
        kvalue=k;
        rvalue=r;
        // console.log('k r set')
        updateKR();
    };

    // if either the k or r values have changed get the outliers for those values and update teh dataplane
    updateKR = function(){
        console.log('range value has changed to :'+'K:'+kvalue+' R:'+rvalue);

        // broadcasts the updateKR value with the kvalue and rvalue arguments
		$rootScope.$broadcast('updateKR', {k:kvalue, r:rvalue});


        // if either of the new values have changed, redraw the dataplane
        if(rvalue===oldR && kvalue===oldK){
            console.log('K and R are the same as previous request');
        }
        else{
	        $http.get('http://localhost:8080/method1?k='+kvalue+'&r='+rvalue)
	            .success(function(data) {
                    // broadcasts the redrawDataPoints with the data argument
	            	$rootScope.$broadcast('redrawDataPoints',{data:data});
	            })
	            .error(function(data) {
	                console.log("Fail getting outlier data");
	            });
        }

    };

    return {setKR: setKR};

}]);