async function init() {
    const data = await d3.csv('https://narquie.github.io/test_scores.csv');
    // Filtering function
    function meanCondition(data, parameters) {
        return d3.mean(data.filter(function(d) {
            var experimental = true;
            if (parameters[0]){
                experimental = (d.teaching_method === "Experimental")
            }
            var standard = true;
            if (parameters[1]){
                standard = (d.teaching_method === "Standard")
            }
            var qualify = true;
            if (parameters[2]){
                qualify = (d.lunch === "Qualifies for reduced/free lunch")
            }
            var notqualify = true;
            if (parameters[3]){
                notqualify = (d.lunch === "Does not qualify")
            }
            var rural = true;
            if (parameters[4]){
                rural = (d.school_setting === "Rural")
            }
            var urban = true;
            if (parameters[5]){
                urban = (d.school_setting === "Urban")
            }
            var suburban = true;
            if (parameters[6]){
                suburban = (d.school_setting === "Suburban")
            }
            var private = true;
            if (parameters[7]){
                private = (d.school_type === "Non-public")
            }
            var public = true;
            if (parameters[8]){
                public = (d.school_type === "Public")
            }
            return(experimental && standard && qualify && notqualify && rural && urban && suburban && private && public)
        }), d => d.posttest);   // The function returns the product of p1 and p2
    }
        function redraw(src){
            $('script[src="' + src + '"]').remove();
            $('<script>').attr('src', src).appendTo('head');
        }
        // Main Scatterplot
        margin = 200
        height = 1000
        width = 1000
        xdomain = [0,100];
        xrange = [0,500];
        ydomain = [0,100];
        yrange = [500,0];
        xs = d3.scaleLinear().domain(xdomain).range(xrange);
        ys = d3.scaleLinear().domain(ydomain).range(yrange);
        d3.select('svg')
        .attr("width",width + margin)
        .attr("height",height + margin)
        .append("g")
        .attr("transform","translate("+margin+","+margin+")")
        .selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        .attr('cx',function(d,i) {return xs(d.pretest);})
        .attr('cy',function(d,i) {return ys(d.posttest);})
        .attr("r",5)
        .attr("fill",function(d,i){ if(d.gender=="Female"){return "#DB25C3"}else{return "#256FDB"}})
        .on("mouseover", function(d,i) {
                    d3.select(this).attr('stroke', "black").append("title").text(function(d,i){return d.gender + " , " + d.pretest});
                })
            .on("mouseout", function() {
                d3.select(this).attr('stroke',"none");
                d3.select(this).select("title").remove();
            })
        d3.select("svg")
        .append("g")
        .attr("transform","translate("+margin+","+(height/2+margin)+")")
        .call(d3.axisBottom(xs));
        d3.select("svg")
        .append("text").attr("transform","translate("+(width/4 + margin)+","+(height/2+margin+50)+")")
        .style("text-anchor", "middle")
        .text("Pretest");
        d3.select("svg")
        .append("g")
        .attr("transform","translate("+margin+","+margin+")")
        .call(d3.axisLeft(ys));
        d3.select("svg")
        .append("text")
        .attr("transform","rotate(-90)")
        .attr("y",margin-50)
        .attr("x",-(height/4 + margin))
        .style("text-anchor", "middle")
        .text("Posttest");

        // Filters
        var filterrural = false;
        var filterurban = false;
        var filtersuburban = false;
        var filterstandard = false;
        var filterexperimental = false;
        var filterpublic = false;
        var filterprivate = false;
        var filterqualify = false;
        var filternotqualify = false;
        
        // Bar Chart School Region
        xbarrange = [0,200]
        ybarrange = [200,0]
        xsbar = d3.scaleLinear().domain(xdomain).range(xbarrange);
        ysbar = d3.scaleLinear().domain(ydomain).range(ybarrange);
        rural = meanCondition(data,[filterexperimental,filterstandard,filterqualify,filternotqualify,true,filterurban,filtersuburban,filterprivate,filterpublic])
        urban = meanCondition(data,[filterexperimental,filterstandard,filterqualify,filternotqualify,filterrural,true,filtersuburban,filterprivate,filterpublic])
        suburban = meanCondition(data,[filterexperimental,filterstandard,filterqualify,filternotqualify,filterrural,filterurban,true,filterprivate,filterpublic])
        d3.select('svg')
        .attr("width",width + margin)
        .attr("height",height + margin)
        .append("g")
        .attr("transform","translate("+margin+","+margin+")")
        .selectAll('rect')
        .data([0,1,2])
        .enter()
        .append('rect')
            .attr('x',function(d,i){return 550 + i*40;})
            .attr('y',function(d,i) {if(i==0){return ysbar(rural)}else{if(i==1){return ysbar(urban)}else{return ysbar(suburban)}};})
            .attr('width',30)
            .attr('height',function(d,i) {if(i==0){return xsbar(rural)}else{if(i==1){return xsbar(urban)}else{return xsbar(suburban)}};})
            .on("mouseover", function() {
                    d3.select(this).attr('stroke', "black");
                })
            .on("mouseout", function() {
                d3.select(this).attr('stroke',"none");
            })
            .on("click",function(d,i){
                if(i == 0 && !filterrural){
                    filterrural = true;
                } else {
                    if(i == 0 && filterrural){
                        filterrural = false;
                    }
                }
                if(i == 1 && !filterurban){
                    filterurban = true;
                } else {
                    if(i == 1 && filterurban){
                        filterurban = false;
                    }
                }
                if(i == 2 && !filtersuburban){
                    filtersuburban = true;
                } else {
                    if(i == 2 && filtersuburban){
                        filtersuburban = false;
                    }
                }
            })
            .style('fill',function(d,i) {if(i==0){return "#32CD32"}else{if(i==1){return "#FF7F7F"}else{return "#aacbe9"}};});
        d3.select("svg")
        .append("g")
        .attr("transform","translate("+750+","+200+")")
        .call(d3.axisLeft(ysbar));
        d3.select("svg")
        .append("text")
        .attr("x",-400)
        .attr("y",770)
        .style("text-anchor", "end")  
        .text("Rural")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",-400)
        .attr("y",810)
        .style("text-anchor", "end")
        .text("Urban")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",-400)
        .attr("y",850)
        .style("text-anchor", "end")
        .text("Suburban")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",750)
        .attr("y",200)
        .style("text-anchor", "start")  
        .text("School Region")
        
        // Teaching type
        standard = meanCondition(data,[filterexperimental,true,filterqualify,filternotqualify,filterrural,filterurban,filtersuburban,filterprivate,filterpublic])
        experimental = meanCondition(data,[true,filterstandard,filterqualify,filternotqualify,filterrural,filterurban,filtersuburban,filterprivate,filterpublic])
        d3.select('svg')
        .attr("width",width + margin)
        .attr("height",height + margin)
        .append("g")
        .attr("transform","translate("+margin+","+margin+")")
        .selectAll('rect')
        .data([0,1])
        .enter()
        .append('rect')
            .attr('x',function(d,i){return 785 + i*40;})
            .attr('y',function(d,i) {if(i==0){return ysbar(standard)}else{return ysbar(experimental)};})
            .attr('width',30)
            .attr('height',function(d,i) {if(i==0){return xsbar(standard)}else{return xsbar(experimental)};})
            .on("mouseover", function() {
                    d3.select(this).attr('stroke', "black");
                })
            .on("mouseout", function() {
                d3.select(this).attr('stroke',"none");
            })
            .on("click",function(d,i){
                if(i == 0 && !filterexperimental){
                    filterexperimental = true;
                } else {
                    if(i == 0 && filterexperimental){
                        filterexperimental = false;
                    }
                }
                if(i == 1 && !filterstandard){
                    filterstandard = true;
                } else {
                    if(i == 1 && filterstandard){
                        filterstandard = false;
                    }
                }
            })
            .style('fill',function(d,i) {if(i==0){return "#E4D00A"}else{return "#CBC3E3"};});
        d3.select("svg")
        .append("g")
        .attr("transform","translate("+985+","+200+")")
        .call(d3.axisLeft(ysbar));
        d3.select("svg")
        .append("text")
        .attr("x",-400)
        .attr("y",1005)
        .style("text-anchor", "end")  
        .text("Standard")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",-400)
        .attr("y",1045)
        .style("text-anchor", "end")
        .text("Experimental")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",985)
        .attr("y",200)
        .style("text-anchor", "start")  
        .text("Teaching Method")
        
        // Public vs Private
        public = meanCondition(data,[filterexperimental,filterstandard,filterqualify,filternotqualify,filterrural,filterurban,filtersuburban,filterprivate,true])
        private = meanCondition(data,[filterexperimental,filterstandard,filterqualify,filternotqualify,filterrural,filterurban,filtersuburban,true,filterpublic])
        d3.select('svg')
        .attr("width",width + margin)
        .attr("height",height + margin)
        .append("g")
        .attr("transform","translate("+margin+","+margin*1.50+")")
        .selectAll('rect')
        .data([0,1])
        .enter()
        .append('rect')
            .attr('x',function(d,i){return 550 + i*40;})
            .attr('y',function(d,i) {if(i==0){return ysbar(public)+200}else{return ysbar(private)+200};})
            .attr('width',30)
            .attr('height',function(d,i) {if(i==0){return xsbar(public)}else{return xsbar(private)};})
            .on("mouseover", function() {
                    d3.select(this).attr('stroke', "black");
                })
            .on("mouseout", function() {
                d3.select(this).attr('stroke',"none");
            })
            .on("click",function(d,i){
                if(i == 0 && !filterpublic){
                    filterpublic = true;
                } else {
                    if(i == 0 && filterpublic){
                        filterpublic = false;
                    }
                }
                if(i == 1 && !filterprivate){
                    filterprivate = true;
                } else {
                    if(i == 1 && filterprivate){
                        filterprivate = false;
                    }
                }
            })
            .style('fill',function(d,i) {if(i==0){return "#aacbe9"}else{return "#d3d3d3"};});
        d3.select("svg")
        .append("g")
        .attr("transform","translate("+750+","+500+")")
        .call(d3.axisLeft(ysbar));
        d3.select("svg")
        .append("text")
        .attr("x",-700)
        .attr("y",770)
        .style("text-anchor", "end")  
        .text("Public")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",-700)
        .attr("y",810)
        .style("text-anchor", "end")
        .text("Non-public")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",750)
        .attr("y",500)
        .style("text-anchor", "start")  
        .text("Type of School")
        

        // Qualifies for free lunch
        qualify = meanCondition(data,[filterexperimental,filterstandard,true,filternotqualify,filterrural,filterurban,filtersuburban,filterprivate,filterpublic])
        notqualify = meanCondition(data,[filterexperimental,filterstandard,filterqualify,true,filterrural,filterurban,filtersuburban,filterprivate,filterpublic])
        d3.select('svg')
        .attr("width",width + margin)
        .attr("height",height + margin)
        .append("g")
        .attr("transform","translate("+margin+","+margin*1.5+")")
        .selectAll('rect')
        .data([0,1])
        .enter()
        .append('rect')
            .attr('x',function(d,i){return 785 + i*40;})
            .attr('y',function(d,i) {if(i==0){return ysbar(qualify)+200}else{return ysbar(notqualify)+200};})
            .attr('width',30)
            .attr('height',function(d,i) {if(i==0){return xsbar(qualify)}else{return xsbar(notqualify)};})
            .on("mouseover", function() {
                    d3.select(this).attr('stroke', "black");
                })
            .on("mouseout", function() {
                d3.select(this).attr('stroke',"none");
            })
            .on("click",function(d,i){
                console.log("click")
                if(i == 0 && !filterqualify){
                    filterqualify = true;
                } else {
                    if(i == 0 && filterqualify){
                        filterqualify = false;
                    }
                }
                if(i == 1 && !filternotqualify){
                    filternotqualify = true;
                } else {
                    if(i == 1 && filternotqualify){
                        filternotqualify = false;
                    }
                }
                redraw()
            })
            .style('fill',function(d,i) {if(i==0){return "#32CD32"}else{return "#FF7F7F"};});
        d3.select("svg")
        .append("g")
        .attr("transform","translate("+985+","+500+")")
        .call(d3.axisLeft(ysbar));
        d3.select("svg")
        .append("text")
        .attr("x",-700)
        .attr("y",1005)
        .style("text-anchor", "end")  
        .text("Qualifies for reduced/free lunch")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",-700)
        .attr("y",1045)
        .style("text-anchor", "end")
        .text("Does not qualify")
        .attr("transform","rotate(-90)");
        d3.select("svg")
        .append("text")
        .attr("x",985)
        .attr("y",500)
        .style("text-anchor", "start")  
        .text("Qualifies for reduced/free lunch")
}