//margin object
var margin = {top:50,bottom:100,right:50,left:50}

var w = 1000 -margin.left-margin.right;
var h = 500 -margin.top-margin.bottom;





var counties_disease = [];
var zip = [];
var ucounty = [];
var county_by_diseases = [];
var diseases = [];
var freq = [];


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
	// console.log(unique(zip));

	//Removing Repeating Values 
	counties_disease = unique(counties_disease);
	ucounty = unique(ucounty);

	// making a select option of counties
	d3.selectAll("#county").selectAll("option").data(ucounty).enter().append("option").text(function(d){return d;}).attr("value",function(d){ return d;});

	//making a select option of county diseases
	d3.selectAll("#county_diseases").selectAll("option").data(counties_disease).enter().append("option").text(function(d){return d;}).attr("value",function(d){ return d;});
	

	//generating counties by diseases
	function diseasesByCounty(selectedCounty){
		county_by_diseases = [];
		for (var i = 0; i < data.length; i++) {
			if(data[i].county == selectedCounty){
				county_by_diseases.push(data[i].episode_disease_category);
			}
		};
		county_by_diseases.sort();
		// console.log(unique(county_by_diseases));
		var ob = {"unique":unique(county_by_diseases),"repeated":county_by_diseases};
		return ob;
	
	}

	//to count the freq of disease 
	function freqDisease (selectedCounty){
		freq = [];
		var temp_data = diseasesByCounty(selectedCounty);
		console.log(temp_data);
		for(var i=0;i<temp_data.unique.length;i++){
			var count = 0;
			
			for(var j=0; j<temp_data.repeated.length;j++){
				if(temp_data.unique[i] == temp_data.repeated[j] ) {
					count++;
				}
			};
			freq.push({"disease":temp_data.unique[i],"freq":count});
		}
		return freq;
	}

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

	
	//Function to draw charts
	function drawBar(selectedDisease){
		
		var data_temp = diseseCount(selectedDisease);
		console.log(data_temp);	
		//creating scales
		var yScale = d3.scale.linear()
				.domain([0,d3.max(data_temp, function(d){ return d.No; })])
				.range([0,h]);

		// console.log(yScale(1));
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
		// console.log(data_temp);	
		//creating scales
		var yScale = d3.scale.linear()
				.domain([0,d3.max(data_temp, function(d){ return d.No; })])
				.range([0,h]);

		
		//creating axis
		var yAxisScale = d3.scale.linear()
				.domain([0,d3.max(data_temp, function(d){ return d.No; })])
				.range([h,0]);
		var yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
		d3.selectAll(".y-axis").remove();
		var yAxisGen = d3.selectAll("#chart svg").select("g");
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

	// function to draw pie chart
	function drawPie (selectedCounty) {
		var width = 400;
		var height = 400;
		var radius = 200;
		var colors = d3.scale.category20c();
		var temp_data = freqDisease(selectedCounty);

		var pie = d3.layout.pie().value(function (d) {
		return d.freq;
		})

		var arc = d3.svg.arc().outerRadius(radius)

		var myChart = d3.select("#chart-two").append("svg").attr("class","pie-chart")
						.attr("width",width).attr("height",height)
						.append("g")
						.attr("transform","translate("+(width-radius)+","+(height-radius)+")")
						.selectAll("path").data(pie(temp_data)).enter().append("path").attr("fill",function(d,i){
							return colors(i);
						}).attr("d",arc);
				

		var text = d3.selectAll("#chart-two-indicators").selectAll("h5")
		.data(temp_data).enter().append("h5")
		.text(function(d){
			return d.disease+" "+d.freq+"%";
		}).attr("class","pie-indicators").style("background",function(d,i){
			return colors(i);
		});

	}

	// function to update pie chart
	function drawPieUpdate (selectedCounty) {
		var width = 400;
		var height = 400;
		var radius = 200;
		var colors = d3.scale.category20c();
		var temp_data = freqDisease(selectedCounty);

		var pie = d3.layout.pie().value(function (d) {
		return d.freq;
		})

		var arc = d3.svg.arc().outerRadius(radius)

		d3.select(".pie-chart").remove();
		var myChart = d3.select("#chart-two").append("svg").attr("class","pie-chart")
						.attr("width",width).attr("height",height)
						.append("g")
						.attr("transform","translate("+(width-radius)+","+(height-radius)+")")
						.selectAll("path").data(pie(temp_data)).enter().append("path").attr("fill",function(d,i){
							return colors(i);
						}).attr("d",arc);
				
		d3.selectAll("#chart-two-indicators").selectAll("h5").remove();

		var text = d3.selectAll("#chart-two-indicators").selectAll("h5").data(temp_data).enter().append("h5")
		.text(function(d){
			return d.disease+" "+d.freq+"%";
		}).attr("class","pie-indicators").style("background",function(d,i){
			return colors(i);
		});

	}


	//default selected value
	drawBar("Hypertension");
	drawPie("New York ");

	//adding a disease event selector to select diseases
	d3.select("#county_diseases").on("change",function(d,i){
		var sel = d3.select(this).node().value;
		drawBarUpdate(sel);
		console.log(sel);

	});

	//adding a disease event selector to county
	d3.select("#county").on("change",function(d,i){
		var sel = d3.select(this).node().value;
		drawPieUpdate(sel);
		console.log(freqDisease(sel));

	});

})
// console.log(openHealth.sodaData);