let xFeatureList = document.getElementById('x-feature');
let yFeatureList = document.getElementById('y-feature');

let xFeature;
let yFeature;

let xSelection;
let ySelection;

let rad = 1;

d3.csv('../static/data_resource/forest_fire_pred.csv', convert, function (data) {
    d3.select('#scatter').select('svg').remove();

    xFeatureList.onclick = function (event) {
        let selection = select(event);

        if (xSelection !== selection) {
            if (xSelection == undefined) {
                xSelection = selection;
                xFeature = xSelection.id.split('-')[1];
                anew(data);
                return;
            } else {
                xSelection.classList.remove('selected');
                xSelection = selection;
                xFeature = xSelection.id.split('-')[1];
            }
            anew(data);
        }
    };

    yFeatureList.onclick = function (event) {
        let selection = select(event);

        if (ySelection !== selection) {
            if (ySelection == undefined) {
                ySelection = selection;
                yFeature = ySelection.id.split('-')[1];
                anew(data);
                return;
            } else {
                ySelection.classList.remove('selected');
                ySelection = selection;
                yFeature = ySelection.id.split('-')[1];
            }
            anew(data);
        }
    };

    function select(event) {
        let target = event.target;
        let selected = document.getElementById(target.id);

        if (!selected.classList.contains('selected')) {
            selected.classList.add('selected');
        }
        return selected
    }
});

function render(data) {
    let margin = {top: 30, bottom: 30, right: 30, left: 30};
    let labelOffset = 15;

    let width = 300;
    let height = 300;

    let inner_width = width - margin.left - margin.right;
    let inner_height = height - margin.top - margin.bottom;

    let svg = d3.select('#scatter').append('svg')
        .attr('width', width)
        .attr('height', height);

    let group = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    // set up x and y
    // ?Value is the value of data on the x axis
    // ?Map maps the value to a position on the chart
    let xScale = d3.scaleLinear().range([0, inner_width]),
        xAxis = d3.axisBottom(xScale),
        xAxisGroup = group.append('g')
            .attr('transform', 'translate(0,' + inner_height + ')'),
        xValue = function (d) {
            return d[xFeature];
        },
        xMap = function (d) {
            return xScale(xValue(d))
        };

    let yScale = d3.scaleLinear().range([inner_height, 0]),
        yAxis = d3.axisLeft(yScale),
        yAxisGroup = group.append('g'),
        yValue = function (d) {
            return d[yFeature];
        },
        yMap = function (d) {
            return yScale(yValue(d))
        };

    let dot = group.selectAll('.dot').data(data);

    let xDomain = [d3.min(data, xValue) - 1, d3.max(data, xValue) + 1];
    let yDomain = [d3.min(data, yValue) - 1, d3.max(data, yValue) + 1];
    // shift domain by 1 so the points do not intersect with the axis
    xScale.domain(xDomain).nice();
    yScale.domain(yDomain).nice();

    var brush = d3.brush().on("end", brushed), timeOut, delay = 500;

    d3.select("svg")
        .append("g")
        .attr("class", "brush")
        .call(brush);

    function brushed() {
        var select = d3.event.selection;

        if (!select) {
            if (!timeOut) return timeOut = setTimeout(out, delay);
            xScale.domain(xDomain);
            yScale.domain(yDomain);
        } else {
            xScale.domain([select[0][0], select[1][0]].map(xScale.invert, xScale));
            yScale.domain([select[1][1], select[0][1]].map(yScale.invert, yScale));
            d3.select("svg").select(".brush").call(brush.move, null);
        }
        zoom();
    }

    function zoom() {
        var transition = d3.select("svg").transition().duration(500);
        d3.select("svg").select(".axis:nth-child(1)").transition(transition).call(xAxis);
        d3.select("svg").select(".axis:nth-child(2)").transition(transition).call(yAxis);
        d3.select("svg").selectAll("circle").transition(transition)
            .attr("cx", function (d) {
                console.log(d);
                return xScale(d[xFeature]);
            })
            .attr("cy", function (d) {
                return yScale(d[yFeature]);
            });
    }

    function out() {
        timeOut = null;
    }

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
        .text(xFeature);

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
        .text(yFeature);

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
}

function disappear() {
    d3.select('#scatter')
        .selectAll('.dot')
        .transition()
        .attr('r', 5 * rad)
        .style('opacity', 0.3)
        .duration(250)
        .transition()
        .attr('r', 0)
        .duration(250);
    d3.select('#scatter')
        .selectAll('.tick')
        .transition().style('opacity', 0)
        .duration(250);
    d3.select('#scatter')
        .selectAll('text')
        .transition()
        .style('fill', 'red')
        .style('opacity', 0)
        .duration(250);
}

function anew(data, deselect) {
    disappear();

    setTimeout(function () {
        d3.select('#scatter')
            .selectAll('svg')
            .remove();
        if (xFeature != undefined && yFeature != undefined) {
            render(data);
        }
    }, 501);
}

function convert(d) {
    d.month = +d.month;
    d.temp = +d.temp;
    d.FFMC = +d.FFMC;
    d.ISI = +d.ISI;
    d.RH = +d.RH;
    d.wind = +d.wind;
    d.area = +d.area;

    return d;
}
