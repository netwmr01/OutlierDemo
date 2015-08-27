angular.module('indexApp').controller('legendCtrl',
    ['$scope', 'legendSet', function($scope,legendSet){
    	
	 $scope.status = {
	    isopen: false
	  };
	 
	 $scope.names= ["Outlierness", "Groups"];
	 
	 //legend that is currently visible
	 $scope.currentlyVisible = 0;
	 
	 $scope.show = function(selection){
		 //if the selected legend and the currently visible legend are different continue
		 if(selection !== $scope.currentlyVisible){
			 //updates the current legend in the legendSet service
			 legendSet.updateLegend(selection);
			 
			 //switch for what to do when switching from a legend
			 switch($scope.currentlyVisible){
			 case 0:
				 break;
			 case 1:
				 //change all dataPoints' group# class to group#invis where # is the group number
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
			 
			 //switch for what to do when switching to a legend
			 switch(selection){
			 case 0:
				 break;
			 case 1:
				 //change all dataPoints' group#invis class to group# where # is the group number
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
			 //changes currentlyVisible to the selection
			 $scope.currentlyVisible=selection;
			 console.log("Showing "+$scope.names[selection]);
			 
		 }else{
			 console.log("Already showing "+ $scope.names[selection])
		 }
	 };

     $scope.$on('updateLegend',function(event,args){
    	 var svg = d3.select('.legendSVG');
    	 
    	 //removes the current legend
    	 svg.selectAll('.legend').remove();
    	 
    	 //gets the current legend
    	 var legends = legendSet.getCurrentLegend();
    	 
    	 //creates the legends and binds the legend data
         var legend = svg.selectAll(".legend")
             .data(legends)
             .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function (d, i) {
                 // console.log(i);
            	 
            	 //makes the grid of the legend, each element has a width of 120 and 
            	 //height of 20 and the whole thing is shifted right 90 
                 return "translate("+(90+ Math.floor(i/2)*120)+ "," + i%2*20 + ")";
                 //return "translate(" + i * 20 + ",90)";
             })
             .on('mousedown', function(d){
//             	console.log("clicked");
//             	console.log(d);
            	 //when a legend element is click change the visiblility of that html class 
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
     
     //when the update Visible event is heard set the visibility
     $scope.$on("updateVisible", function(){
//    	 console.log("updating Visible");	
    	 setVisibility();
    	 });
     
     //gets the list of invisible classes and sets all datapoints with those classes to 0
     function setVisibility(){
    	 //gets the list of invisible classes from the legendSet service
    	 var invisible = legendSet.getVisible();
//    	 console.log(invisible);
    	 //selects all the data points
    	 var dataPoints = d3.selectAll(".dot.dataPoint");
    	 
    	 dataPoints.each(function(d,i){
    		 // flag to for if the .dataPoint class is returned ie. the user want the inliers to be invisible
    		 var dataPoint = false;
    		 
    		 //gets the current point as a d3 selection and makes it visible
    		 var point = d3.select(this);
			 point.classed('invisible', false);

    		 var classes = point.attr("class").split(" ");
//    		 console.log(classes);
    		 
    		 //goes through the class array and sets it invisible if any element 
    		 //in the class array matches any in the invisible array, excluding dataPoint
    		 //if any do match, the datapoint is not an inlier* otherwise it is, isInlier reflects this
    		 //*OR we are viewing another color scheme/legend and do not care about the outlier
    		 var isInlier = !invisible.some(function(className, index){
//    			 if(i%1000 === 0){ console.log("Index: "+index+" class "+className+" ID: "+ d); console.log(point.node());}
    			 if(className==="dataPoint"){
    				 dataPoint = true;
    			 }else{
	    			 if(classes.indexOf(className) !== -1){
	    				 point.classed('invisible', true);
						 return true;
	    			 }else{
	    				 point.classed('invisible', false);
	    				 return false
	    			 }
    			 }
    		 });
    		 
    		 //if the .dataPoint class is selected to be invisible 
    		 //and the point is an inlier make the point invisible
        	 if(dataPoint && isInlier){
    			 point.classed('invisible', true);
        	 }
    	 });
     }
    }]);