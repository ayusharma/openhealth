//margin object
var margin = {top:50,bottom:150,right:50,left:50}

var w = 1000 -margin.left-margin.right;
var h = 500 -margin.top-margin.bottom;



var count = 0;

var counties_disease = [];
var zip = [];
var ucounty = [];
var county_by_diseases = [];
var diseases = [];


//Graph Variables
var width_bar = 50;
var padding = 2;


var svg = d3.select("#chart").append("svg").style("background","#ccc")
	.attr("width",w + margin.left + margin.right)
	.attr("height",h + margin.top + margin.bottom)
	.append("g")
	.attr("transform","translate("+margin.left+","+margin.top+")");


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

	//Removing Repeating Values 
	counties_disease = unique(counties_disease);
	ucounty = unique(ucounty);

	// making a select option of counties
	d3.selectAll("#county").selectAll("option").data(ucounty).enter().append("option").text(function(d){return d;}).attr("value",function(d){ return d;});

	//making a select option of county diseases
	d3.selectAll("#county_diseases").selectAll("option").data(counties_disease).enter().append("option").text(function(d){return d;}).attr("value",function(d){ return d;});
	

	//generating counties by diseases
	var temp_county = "New York "
	for (var i = 0; i < data.length; i++) {
		if(data[i].county == temp_county){
			county_by_diseases.push(data[i].episode_disease_category);
		}
	};
	county_by_diseases.sort();
	console.log(unique(county_by_diseases));

	//generating disese count
	function diseseCount(selectedDisease){
		diseases = [];
		for (var i = 0; i < ucounty.length; i++) {
			var count = 0;
			diseases.push({"county":ucounty[i],"No":count});
			for (var j = 0; j < data.length; j++) {
				if(data[j].county == ucounty[i] && data[j].episode_disease_category == selectedDisease){
					count++;
				}
			}
			diseases[i].No = count;
		}

		console.log(diseases);
		return diseases;
	}
	//county by diseases
	
	//Function to draw charts
	function drawBar(selectedDisease){
		
		var data_temp = diseseCount(selectedDisease);
		console.log(data_temp);	
		//creating scales
		var yScale = d3.scale.linear()
				.domain([d3.min(data_temp, function(d){ return d.No; }),d3.max(data_temp, function(d){ return d.No; })])
				.range([0,h]);

		//creating axis
		var yAxisScale = d3.scale.linear()
				.domain([0,d3.max(data_temp, function(d){ return d.No; })])
				.range([h,0]);
		var yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
		var yAxisGen = d3.select("svg").append("g").attr("class","y-axis");
		yAxis(yAxisGen);

		yAxisGen.attr("transform","translate("+margin.left+","+margin.right+")");
		yAxisGen.selectAll("path").style({fill:"none",stroke:"#000"});
		yAxisGen.selectAll("line").style({stroke:"#000"});

		var xAxisScale = d3.scale.linear()
				.domain([0,data_temp.county])
				.range([w,0]);

		var xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");
		var xAxisGen = d3.select("svg").append("g").attr("class","x-axis");
		xAxis(xAxisGen);

		xAxisGen.attr("transform","translate("+margin.left+","+(h+margin.top)+")");
		xAxisGen.selectAll("path").style({fill:"none",stroke:"#000"});
		xAxisGen.selectAll("line").style({stroke:"#000"});

		d3.selectAll(".x-axis").selectAll("text").data(data_temp).enter().append("text").attr("class","x-axis-county").text(function(d){return d.county;}).attr({
			x:-margin.bottom+10,
			y:function(d,i){ return i*(w/data_temp.length)+25;},
		});
		
		//drawing bar chart for city V/S no. of people have diseases
		svg.selectAll("rect").data(data_temp).enter().append("rect").transition()
		.attr({
			x: function(d,i){ return i*(w/data_temp.length)},
			y: function(d){ return h-yScale(d.No);},
			width:function(d){ return (w/(data_temp.length))-2},
			height:function(d){return yScale(d.No);}
		}).style("fill","#F60");

		
	}

	//function to update bar chart

	function drawBarUpdate(selectedDisease){
		
		var data_temp = diseseCount(selectedDisease);
		console.log(data_temp);	
		//creating scales
		var yScale = d3.scale.linear()
				.domain([d3.min(data_temp, function(d){ return d.No; }),d3.max(data_temp, function(d){ return d.No; })])
				.range([0,h]);

		
		//creating axis
		var yAxisScale = d3.scale.linear()
				.domain([0,d3.max(data_temp, function(d){ return d.No; })])
				.range([h,0]);
		var yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
		d3.selectAll(".y-axis").remove();
		var yAxisGen = d3.selectAll("svg").select("g");
		yAxis(yAxisGen);

		yAxisGen.attr("transform","translate("+margin.left+","+margin.right+")");
		yAxisGen.selectAll("path").style({fill:"none",stroke:"#000"});
		yAxisGen.selectAll("line").style({stroke:"#000"});



		//drawing bar chart for city V/S no. of people have diseases
		svg.selectAll("rect").remove();
		svg.selectAll("rect").data(data_temp).enter().append("rect").transition()
		.attr({
			x: function(d,i){ return i*(w/data_temp.length)},
			y: function(d){ return h-yScale(d.No);},
			width:function(d){ return (w/(data_temp.length))-2},
			height:function(d){return yScale(d.No);}
		}).style("fill","#F60");

		
	}


	//default selected value
	drawBar("Hypertension");

	//adding a disease event selector 
	d3.select("#county_diseases").on("change",function(d,i){
		var sel = d3.select(this).node().value;
		drawBarUpdate(sel);
		console.log(sel);

	});

})
console.log(openHealth.sodaData);