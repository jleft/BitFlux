(function(sc) {
    'use strict';

    sc.chart.xAxis = function() {

        var xAxisHeight = 20;
        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(6);

        function xAxisChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            // Redraw
            var xAxisContainer = selection.selectAll('g.x-axis')
                .data([data]);
            xAxisContainer.enter()
                .append('g')
                .attr('class', 'axis x-axis')
                .layout({
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    height: xAxisHeight
                });

            selection.layout();

            xScale.range([0, xAxisContainer.layout('width')])
                .domain(viewDomain);

            xAxisContainer.call(xAxis);
        }

        return xAxisChart;
    };
})(sc);