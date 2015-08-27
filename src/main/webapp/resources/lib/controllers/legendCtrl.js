angular.module('indexApp').controller('legendCtrl',
    ['$scope', 'legendSet', function($scope,legendSet){
    	
	 $scope.status = {
	    isopen: false
	  };
	 
	 $scope.names= ["Outlierness", "Groups"];
	 
	 $scope.currentlyVisible = 0;
	 
	 $scope.show = function(selection){
		 if(selection !== $scope.currentlyVisible){
			 legendSet.updateLegend(selection);
			 switch($scope.currentlyVisible){
			 case 0:
				 break;
			 case 1:
				 d3.selectAll('.group0')
				 	.classed('group0invis',true)
				 	.classed('group0',false);

				 d3.selectAll('.group1')
				 	.classed('group1invis',true)
				 	.classed('group1',false);

				 d3.selectAll('.group2')
				 	.classed('group2invis',true)
				 	.classed('group2',false);

				 d3.selectAll('.group3')
				 	.classed('group3invis',true)
				 	.classed('group3',false);
				 break;
			 }
			 switch(selection){
			 case 0:
				 break;
			 case 1:
				 d3.selectAll('.group0invis')
				 	.classed('group0invis',false)
				 	.classed('group0',true);
				 
				 d3.selectAll('.group1invis')
				 	.classed('group1invis',false)
				 	.classed('group1',true);
				 
				 d3.selectAll('.group2invis')
				 	.classed('group2invis',false)
				 	.classed('group2',true);
				 
				 d3.selectAll('.group3invis')
				 	.classed('group3invis',false)
				 	.classed('group3',true);
				 break;
			 }
			 $scope.currentlyVisible=selection;
			 console.log("Showing "+$scope.names[selection]);
			 
		 }else{
			 console.log("Already showing "+ $scope.names[selection])
		 }
	 };

     $scope.$on('updateLegend',function(event,args){
    	 var svg = d3.select('.legendSVG');
    	 
    	 svg.selectAll('.legend').remove();
    	 
    	 var legends = legendSet.getCurrentLegend();
    	 
         var legend = svg.selectAll(".legend")
             .data(legends)
             .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function (d, i) {
                 // console.log(i);
                 return "translate("+(90+ Math.floor(i/2)*120)+ "," + i%2*20 + ")";
                 //return "translate(" + i * 20 + ",90)";
             })
             .on('mousedown', function(d){
             	console.log("clicked");
             	console.log(d);
             	legendSet.setVisible(d.class_name);
             	setVisibility();
             });

         // draw legend colored rectangles
         legend.append("rect")
             .attr("width", 18)
             .attr("height", 18)
             .attr("class", function (d) {
                 return d.class_name +" legendBox";
             });

         // draw legend text
         legend.append("text")
             .attr("dy", "1em")
             .attr('dx', "-5px")
             .style("text-anchor", "end")
             .style("font-size", "12")
             .attr("class", "legendText")
             .text(function (d) {
                 return d.actual_name;
             });
     });
     
     $scope.$on("updateVisible", function(){
//    	 console.log("updating Visible");	
    	 setVisibility();
    	 });
     
     function setVisibility(){
    	 var invisible = legendSet.getVisible();
    	 console.log(invisible);
    	 var dataPoints = d3.selectAll(".dot.dataPoint");
    	 
    	 dataPoints.each(function(d,i){
    		 var dataPoint = false;
    		 var point = d3.select(this);
			 point.classed('invisible', false);
//    		 console.log(i)
    		 var classes = point.attr("class").split(" ");
//    		 console.log(classes);
//			 point.classed('invisible',false);
    		 var isInlier = !invisible.some(function(className, index){
//    			 if(i%1000 === 0){ console.log("Index: "+index+" class "+className+" ID: "+ d); console.log(point.node());}
    			 if(className==="dataPoint"){
    				 dataPoint = true;
    			 }else{
	    			 if(classes.indexOf(className) !== -1){
//						 console.log("Index: "+ i + " class: "+className);
	    				 point.classed('invisible', true);
//						 console.log(point.node())
						 return true;
	    			 }else{
	    				 point.classed('invisible', false);
	    				 return false
	    			 }
    			 }
    		 });
        	 if(dataPoint && isInlier){
    			 point.classed('invisible', true);
        	 }
    	 });
     }
    }]);