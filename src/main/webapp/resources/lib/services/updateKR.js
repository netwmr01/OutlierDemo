angular.module('indexApp').factory('updateKR',
    ['$http','$rootScope', function($http,$rootScope){

	kvalue=5;
    rvalue=5000;
    oldK=0;
    oldR=0;


    /**
     * @param integer k
     * @param integer r
     */
    setKR = function(k,r){
        kvalue=k;
        rvalue=r;
        // console.log('k r set')
        updateKR();
    };

    updateKR = function(){
        console.log('range value has changed to :'+'K:'+kvalue+' R:'+rvalue);


		$rootScope.$broadcast('updateKR', {k:kvalue, r:rvalue});

        if(rvalue===oldR && kvalue===oldK){
            console.log('K and R are the same as previous request');
        }
        else{
	        $http.get('http://localhost:8080/method1?k='+kvalue+'&r='+rvalue)
	            .success(function(data) {
	            	$rootScope.$broadcast('redrawDataPoints',{data:data});
	            })
	            .error(function(data) {
	                console.log("Fail getting outlier data");
	            });
        }
        oldK=kvalue;
        oldR=rvalue;

    };

    return {setKR: setKR};

}]);