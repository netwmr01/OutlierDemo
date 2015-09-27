angular.module('indexApp').directive('domination', 
    ['$http','$window', function($http, $window){
    return{
        restrict:'E',
        link: link,
        scope: { data: '=' }
    };

    function link(scope,element,attr){
        var margin, height,width;
        var svg;
        var d3 = $window.d3;
        var clipPath;

        setParameters();
        // plotGraph();

        //sets the parameters
        function setParameters(){
            // magins and dimensions of the svg
            
            var paneDimensions= d3.select('.left.paneContent').node().getBoundingClientRect();
            margin = {top: 20, right: 40, bottom: 40, left: 40};
            width = paneDimensions.width - margin.left - margin.right;
            height = paneDimensions.height- 42 - margin.top - margin.bottom;

            // Adds the svg canvas
            svg = d3.select(element[0])
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append("svg")
                .attr("viewBox", "0 0 "+ (width + margin.left + margin.right)+
                    ' '+ (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true)
                .append("g")
                .classed('dominationGraph',true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("pointer-events", "all");
                // .call(zoom);

            // creates graph backdrop
            svg
                .append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr('fill','#ddd')
                .attr('stroke','black')
                .attr('class','domGraph');

            svg.append('g')
                .style("pointer-events", "all");

            // creates the clipping rectangle
            svg.append("clipPath")
                .attr("id", "clip3")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

           
            var force = d3.layout.force()
                .charge(-120)
                .linkDistance(10)
                .size([width, height])
                .gravity(1);


            $http.get("getGraph")
            	.success(function(graph) {
	                var linkg = svg.append("g")
	                    .attr('class','links');
	                
	                var link = linkg.selectAll(".link")
	                    .data(graph.links)
	                    .enter().append("line")
	                    .attr("class", function(d){return "link source" +d.source+" target"+d.target;})
	                    .style("stroke-width", function(d) { 
	                        return 1;//Math.sqrt(d.value);
	                    });
	
	                // console.log(link);
	
	                var nodeg = svg.append("g")
	                    .attr('class','nodes');
	
	                var nodes = nodeg.selectAll(".node")
	                    .data(graph.nodes)
	                    .enter().append("circle")
	                    .attr("class", "node")
	                    .attr("r", 3)
	                    .attr('index', function(d,i){
	                        return i;
	                    })
	                    .attr('id',function(d){ return 'did'+d.id;})
	                    .attr('clip-path','url#clip3')
	                    .on("mouseover",function(d){
	                    	console.log("highlighting"+d.id);
	                    	
	                    	//gets all links with this node as a source or target
	                        var source = d3.selectAll(".source"+d.id);
	                        var target = d3.selectAll(".target"+d.id);
	
	                        source.each(function(element){
	                            // console.log(this);
	
	                            linkg.append('line')
	                                .attr("x1", this.getAttribute('x1'))
	                                .attr("y1", this.getAttribute('y1'))
	                                .attr("x2", this.getAttribute('x2'))
	                                .attr("y2", this.getAttribute('y2'))
	                                .attr("class","link link"+d.id+" highlight ");
	                        });
	                        target.each(function(element){
	
	                            linkg.append('line')
	                                .attr("x1", this.getAttribute('x1'))
	                                .attr("y1", this.getAttribute('y1'))
	                                .attr("x2", this.getAttribute('x2'))
	                                .attr("y2", this.getAttribute('y2'))
	                                .attr("class","link link"+d.id+" highlight");
	                        });
	
	                    })
	                    .on("mouseout",function(d){
	                    	//removes all highlighted links
	                        d3.selectAll('.link.link'+d.id+'.highlight')
	                            .remove();
	                    });
	
	
	                var nodeReference = {};
	
	                var findNode =function(id){
	                    id = id.toString();
	                    if(nodeReference.hasOwnProperty(id)){
	                        if(nodeReference[id]==='null') return null;
	                        else return  nodeReference[id];
	                    }
	
	                    var searchedNode =d3.select('#did'+id);
	                    // console.log(searchedNode.empty());
	                    if(searchedNode.empty()){
	                        nodeReference[id]='null';
	                        return null;  
	                    } 
	                    else {
	                        // console.log("Found ID: " + id);
	                        var nodeIndex = Number(searchedNode.attr('index'));
	                        nodeReference[id] = nodeIndex;
	                        return nodeIndex;
	                    }
	                };
	
	                // var brokenLinks =0;
	                // graph.links.forEach(function(d) {
	                //     if (typeof d.source == "number") { d.source = findNode(d.source); }
	                //     if (typeof d.target == "number") { d.target = findNode(d.target); }
	                //     if(d.source===null || d.target===null) brokenLinks++;
	                // });
	
	                // console.log(Object.keys(nodeReference));
	                // console.log(Object.keys(nodeReference).filter(function(id){
	                //     return nodeReference[id.toString()] === 'null';
	                // }));
	                // console.log(graph.links);
	
	                force
	                    .nodes(graph.nodes)
	                    .links(graph.links);
	
	                // console.log("done adjusting graph");
	
	                $http.get("getGroup?groupnumber=123")
		                .success(function(groups) {
		                    console.log(groups);
		                    for( var group in groups){
		                        groups[group].forEach(setGroups, group);
		                        
		                        var groupg=nodeg.append('g')
		                                        .attr('class','layer '+group);
		
		                        var nodeGroup = svg.selectAll('.node.'+group);
		                        // console.log(group);
		                        // console.log(nodeGroup);
		                        // console.log(nodeGroup.empty());
		                        if(!nodeGroup.empty()){
		                            nodeGroup.each(function(d,i){
		                                // console.log(d3.select(this).node());
		                                var removed = d3.select(this).remove();
		                                groupg.append(function() {
		                                  return removed.node();
		                                });
		                            });
		                        }
		                    }
		                    //sort nodes in by groups
		
		                    // console.log(graph.nodes);
		                    var step = 2*Math.PI/graph.nodes.length;
		                    var ellipseX = function(angle){//angle is in radians
		                        return (width-10)/2*Math.cos(angle);
		                    };
		                    var ellipseY = function(angle){//angle is in radians
		                        return (height-10)/2*Math.sin(angle);
		                    };
		
		                    nodes.attr("cx", function(d,i){return ellipseX(i*step)+width/2;})
		                        .attr("cy",function(d,i){return ellipseY(i*step)+height/2;});
		
		
		
		                    link.each(function(d,i){
		                        var source = d3.select('#did'+d.source);
		                        var target = d3.select('#did'+d.target);
		                        if(i%1000===0){
		                            // console.log('source: #did'+d.source+' target: #did'+d.target);
		                            // console.log(source.node());
		                            // console.log(target.node());
		                        }
		                        var thisLink = d3.select(this);
		                        if(i%1000===0){
		                            // console.log(this);
		                            // console.log(thisLink);
		                        }
		                        thisLink
		                            .attr("x1", function(d) { return source.attr('cx'); })
		                            .attr("y1", function(d) { return source.attr('cy'); })
		                            .attr("x2", function(d) { return target.attr('cx'); })
		                            .attr("y2", function(d) { return target.attr('cy'); });
		
		                        if(i%1000===0){
		                            // console.log(this);
		                            // console.log(thisLink);
		                        }
		                })
	
	                    // console.log(graph.links);
	
	                    console.log('Finished Dom Graph');
	
	                    // console.log(nodes);
	
	                    // nodes.append("title")
	                    //     .text(function(d) { return 'did'+d.id; });
	
	                    // console.log("start adjusting graph");
	                    // console.log(force.links());
	
	                    // console.log(force.nodes());
	
	                    // var m=300;
	                    // console.log(m);
	                    
	                        // var n = nodes.length;
	                        // nodes.forEach(function(d, i) {
	                        //   d.x = d.y = width / n * i;
	                        // });
	
	
	                    // force.start();
	                    // console.log('starting ticks');
	                    // for (var i = 0; i < m; ++i) {
	                    //     if(i%10 === 0) {console.log('tick: '+i);}
	                    //     force.tick();
	                    // }
	                    // force.stop();
	                    // // console.log(link);   
	                    
	
	                    // force.on("tick", function() {   
	                    //     link.attr("x1", function(d) { return d.source.x; })
	                    //         .attr("y1", function(d) { return d.source.y; })
	                    //         .attr("x2", function(d) { return d.target.x; })
	                    //         .attr("y2", function(d) { return d.target.y; });
	
	                    //     nodes.attr("cx", function(d) { return d.x; })
	                    //         .attr("cy", function(d) { return d.y; });
	                    // });
	
	                    // force.on("tick", function(e) {
	
	                    //     nodes.attr("transform", function(d) { 
	                    //         //TODO move these constants to the header section
	                    //         //center the center (root) node when graph is cooling down
	                    //         if(d.classed('Group2')){
	                    //             damper = 0.1;
	                    //             d.x = d.x + (w/2 - d.x) * (damper + 0.71) * e.alpha;
	                    //             d.y = d.y + (h/2 - d.y) * (damper + 0.71) * e.alpha;
	                    //         }
	                    //         //start is initiated when importing nodes from XML
	                    //         if(d.start === true){
	                    //             d.x = w/2;
	                    //             d.y = h/2;
	                    //             d.start = false;
	                    //         }
	
	                    //         r = d.name.length;
	                    //         //these setting are used for bounding box, see [http://blockses.appspot.com/1129492][1]
	                    //         d.x = Math.max(r, Math.min(w - r, d.x));
	                    //         d.y = Math.max(r, Math.min(h - r, d.y));
	
	                    //         return "translate("+d.x+","+d.y+")";            
	
	                    //     });
	                    // });  
	
	                    // nodes.attr("cx", function(d) { return d.x; })
	                    //     .attr("cy", function(d) { return d.y; });
	
	                    // link.attr("x1", function(d) { return d.source.x; })
	                    //     .attr("y1", function(d) { return d.source.y; })
	                    //     .attr("x2", function(d) { return d.target.x; })
	                    //     .attr("y2", function(d) { return d.target.y; });
	
	                    // console.log(force.nodes());
	                    // console.log(force.links());
	
	                })
	                .error(function(){
	                	console.log("Error geting groups for dom graph")
	                });
	            })
	            .error(function(){
	            	console.log("Error geting dom graph")
	            });

            function setGroups(gNode, index, array){
//                if(index%1000 === 0){
//                	console.log(this);
//                	console.log(gNode.id)}
            	var id = gNode.id;
                svg.select('#did'+id)
                	.classed(this,true);
            }

        }

        // creates axis
        function plotGraph(){
            createAxis();
        }
    }   
}]);