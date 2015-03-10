

var w = 500;
var h = 500;
var count = 0;

var counties_disease = [];
var zip = [];
var ucounty = [];
var hyper = [];


//Graph Variables
var width_bar = 50;
var padding = 2;


var svg = d3.select("#chart").append("svg").attr({width:w,height:h}).style("background","#CCC");


d3.json("data.json",function  (data) {

	for (var i = 0; i < data.length; i++) {
			counties_disease.push(data[i].episode_disease_category);
			ucounty.push(data[i].county);	
			zip.push(data[i].zip_code);	
	}

	counties_disease.sort();
	ucounty.sort();
	zip.sort();

	function unique(m){
		var prev = m[0];
		var m_sort = [];
		m_sort.push(prev);
		for (var i = 0; i < m.length; i++) {
			if(m[i] != prev){
				m_sort.push(m[i]);
				prev = m[i];
			}
		};
		return m_sort;
	}

	console.log(unique(counties_disease));
	console.log(unique(ucounty));
	console.log(unique(zip));

	
	ucounty = unique(ucounty);
	for (var i = 0; i < ucounty.length; i++) {
		var count = 0;
		hyper.push({"county":ucounty[i],"No":count});
		for (var j = 0; j < data.length; j++) {
			if(data[j].county == ucounty[i] && data[j].episode_disease_category == "Hypertension"){
				count++;
			}
		}
		hyper[i].No = count;
	}
	console.log(hyper);

	//making a select option
	d3.selectAll("#county").selectAll("option").data(ucounty).enter().append("option").text(function(d){return d;}).attr("value",function(d){ return d;});
	// d3.selectAll("option").text("hi");
	//creating scales
	var yScale = d3.scale.linear()
				.domain([d3.min(hyper, function(d){ return d.No; }),d3.max(hyper, function(d){ return d.No; })])
				.range([15,h]);


	//drawing bar chart for city V/S no. of people have hypertension

	svg.selectAll("rect").data(hyper).enter().append("rect")
	.attr({
		x: function(d,i){ return i*(w/hyper.length)},
		y: function(d){ return h-yScale(d.No);},
		width:function(d){ return (w/(hyper.length))-2},
		height:function(d){return yScale(d.No);}
	}).style("fill","#F60");

})
