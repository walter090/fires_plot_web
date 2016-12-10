function renderP() {
    let margin = {top: 50, bottom: 50, right: 50, left: 50};
    let labelOffset = 15;

    let width = 550;
    let height = 400;

    let inner_width = width - margin.left - margin.right;
    let inner_height = height - margin.top - margin.bottom;

    var xScale = d3.scalePoint().rangeRound([0, inner_width], 1);
    var yScale = {};
    var pull = {};

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
            })
            .call(d3.drag()
                .subject(function (d) {
                    return {xScale: xScale(d)};
                })
                .on("start", function (d) {
                    pull[d] = xScale(d);
                    path.attr("visibility", "hidden");
                })
                .on("drag", function (d) {
                    pull[d] = Math.min(inner_width, Math.max(0, d3.event.x));
                    pathFocus.attr("d", pathPlot);
                    features.sort(function (x, y) {
                        return place(x) - place(y);
                    });
                    xScale.domain(features);
                    group.attr("transform", function (d) {
                        return "translate(" + place(d) + ")";
                    })
                })
                .on("end", function (d) {
                    delete pull[d];
                    transition(d3.select(this)).attr("transform", "translate(" + xScale(d) + ")");
                    transition(pathFocus).attr("d", pathPlot);
                    path.attr("d", pathPlot)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));


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
            .style('stroke', 'grey')
            .style('stroke-width', 0.07);

        let pathFocus = svg.append('g')
            .attr('class', 'line-path-focus')
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', pathPlot)
            .style('fill', 'none')
            .style('stroke', 'red')
            .style('stroke-width', 0.07);

        group.append("g")
            .attr("class", "brush")
            .each(
                function (d) {
                    d3.select(this)
                        .call(yScale[d].brush = d3
                            .brushY(yScale[d])
                            .extent([[-8, 0], [8, inner_height]])
                            .on("start", brushStart)
                            .on("brush", brushed))
                });

        function place(d) {
            var pos = pull[d];
            return pos == null ? xScale(d) : pos;
        }

        function brushStart() {
            d3.event.sourceEvent.stopPropagation();
        }

        function brushed() {
            let allAxes = {};
            let allExtents = {};
            for (let i = 1; i <= 10; i++) {
                let axis = d3.select(".feature:nth-child(" + i + ")")
                    .select(".brush");

                allAxes[features[i - 1]] = axis
                    .select(".selection")
                    .attr("height");

                let up = d3.select(".feature:nth-child(" + i + ")")
                    .select(".brush")
                    .select(".selection")
                    .attr("y");
                let height = d3.select(".feature:nth-child(" + i + ")")
                    .select(".brush")
                    .select(".selection")
                    .attr("height");

                let down = parseInt(up) + parseInt(height);

                let fea = features[i - 1];

                allExtents[fea] = [yScale[fea].invert(down), yScale[fea].invert(up)];
            }

            let extents = [];

            for (let key in allExtents) {
                if (allExtents[key][0]) {
                    extents.push([allExtents[key][0], allExtents[key][1]]);
                }
            }

            var focused = features.filter(function (p) {
                return allAxes[p] != null;
            });

            pathFocus.style("display", function (d) {
                return focused.every(function (p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });
        }

        function pathPlot(d) {
            return line(features.map(function (i) {
                return [xScale(i), yScale[i](d[i])];
            }));
        }
    }
}

renderP();