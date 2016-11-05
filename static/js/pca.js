var margin = {top: 50, bottom: 50, right: 50, left: 50};
var labelOffset = 15;

var width = 500;
var height = 700;

var inner_width = width - margin.left - margin.right;
var inner_height = height - margin.top - margin.bottom;

var rad = 1;

d3.csv('../static/data_resource/pca_components.csv', function (data) {
    render(data)
});

d3.csv('../static/data_resource/ei.csv', function (data) {
    var xDomain = math.range(1, 11)._data;
    var xScale = d3.scalePoint()
            .range([0, inner_width])
            .domain(xDomain),
        xAxis = d3.axisBottom(xScale);

    var yScale = d3.scaleLinear()
            .range([inner_height, 0])
            .domain(d3.extent(data, function (d) {
                return d['value'];
            })),
        yAxis = d3.axisLeft(yScale);

    var svg = d3.select('#scree').append('svg')
        .attr('width', width)
        .attr('height', height);

    var group = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var bar = svg.selectAll('.bar').data(data);

    var tip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute');

    var xAxisGroup = group.append('g')
        .attr('transform', 'translate(0,' + inner_height + ')')
        .attr('class', 'axis')
        .call(xAxis);

    var yAxisGroup = group.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    bar.enter()
        .append('rect')
        .attr('class', '.bar')
        .attr('width', 50)
        .attr('x', function (d) {
            return xScale(d['index']) + margin.left;
        })
        .attr('y', function (d) {
            return yScale(d['value']) + margin.top;
        })
        .attr('height', function (d) {
            return inner_height - yScale(d['value']);
        })
        .style('fill', 'white')
        .on('mouseover', function (d) {
            d3.select(this)
                .transition()
                .style('fill', 'darkred')
                .duration(1500);
            tip.transition()
                .style('opacity', .9)
                .duration(500);
            tip.html(d['value'])
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .style('fill', 'white')
                .duration(1000);
            tip.transition()
                .style("opacity", 0)
                .duration(500);
        });
});

function render(data) {
    var vectors = {'P1': [], 'P2': []};
    data.forEach(function (d) {
        vectors['P1'].push(+d['P1']);
        vectors['P2'].push(+d['P2']);
    });

    var points = [{}];
    d3.csv('../static/data_resource/pred.csv', function (d) {
        var svg = d3.select('#pca').append('svg')
            .attr('width', width)
            .attr('height', height);

        var group = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        d.forEach(function (i) {
            points.push({x: math.dot(vectors['P1'], Object.values(i).splice(1, 10)),
                         y: math.dot(vectors['P2'], Object.values(i).splice(1, 10))});
        });

        var xValue = function (d) {
                return d['x'];
            },
            xScale = d3.scaleLinear()
                .rangeRound([0, inner_width])
                .domain(d3.extent(points, xValue))
                .nice(),
            xMap = function (d) {
                return xScale(xValue(d))
            },
            xAxis = d3.axisBottom(xScale),
            xAxisGroup = group.append('g')
                .attr('transform', 'translate(0,' + inner_height + ')');

        var yValue = function (d) {
                return d['y'];
            },
            yScale = d3.scaleLinear()
                .rangeRound([inner_height, 0])
                .domain(d3.extent(points, yValue))
                .nice(),
            yMap = function (d) {
                return yScale(yValue(d))
            },
            yAxis = d3.axisLeft(yScale),
            yAxisGroup = group.append('g');
        var dot = group.selectAll('.dot').data(points);

        xAxisGroup
            .transition()
            .duration(1000)
            .attr('class', 'axis')
            .call(xAxis);

        xAxisGroup
            .append('text')
            .attr('x', inner_width)
            .attr('y', -labelOffset / 2)
            .attr('fill', '#000')
            .style('text-anchor', 'end')
            .text('P1');

        yAxisGroup
            .transition()
            .duration(1000)
            .attr('class', 'axis')
            .call(yAxis);

        yAxisGroup
            .attr('class', 'axis')
            .append('text')
            .attr('y', labelOffset)
            .attr('transform', 'rotate(-90)')
            .attr('fill', '#000')
            .style('text-anchor', 'end')
            .text('P1');

        dot.enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', rad)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r', 0)
            .transition()
            .style('fill', 'red')
            .attr('r', 5 * rad)
            .style('opacity', 0.3)
            .duration(500)
            .transition()
            .attr('r', rad)
            .style('opacity', 1)
            .duration(1000);
    });
}