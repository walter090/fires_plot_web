function renderP() {
    let margin = {top: 50, bottom: 50, right: 50, left: 50};
    let labelOffset = 15;

    let width = 550;
    let height = 400;

    let inner_width = width - margin.left - margin.right;
    let inner_height = height - margin.top - margin.bottom;

    let xScale = d3.scalePoint().rangeRound([0, inner_width], 1);
    let yScale = {};

    let line = d3.line();
    let axis = d3.axisLeft();

    let svg = d3.select('#parallel')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');
    d3.csv('../static/data_resource/ordered.csv', function (data) {
        render(data);
    });

    function render(data) {
        let features = d3.keys(data[0]).splice(1, 13);
        xScale.domain(features);

        features.forEach(function (d) {
            yScale[d] = d3.scaleLinear()
                .domain(d3.extent(data, function (i) {
                    return +i[d];
                }))
                .range([inner_height, 0]);
        });

        let group = svg.selectAll('.feature')
            .data(features)
            .enter()
            .append('g')
            .attr('class', 'feature')
            .attr('transform', function (d) {
                return 'translate(' + xScale(d) + ')';
            });

        group.append('g')
            .attr('class', 'axis')
            .each(function (d) {
                d3.select(this)
                    .call(axis.scale(yScale[d]));
            })
            .append('text')
            .style('text-anchor', 'middle')
            .attr('y', -labelOffset)
            .text(function (d) {
                return d;
            });

        let path = svg.append('g')
            .attr('class', 'line-path')
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', pathPlot)
            .style('fill', 'none')
            .style('stroke', 'red')
            .style('stroke-width', 0.07);

        function pathPlot(d) {
            return line(features.map(function (i) {
                return [xScale(i), yScale[i](d[i])];
            }));
        }
    }
}

renderP();