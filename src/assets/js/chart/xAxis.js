(function(d3, fc, sc) {
    'use strict';

    sc.chart.xAxis = function() {

        var xAxisHeight = 20;
        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(6);

        var dataJoin = fc.util.dataJoin()
            .selector('g.x-axis')
            .element('g')
            .attr('class', 'x-axis');

        function xAxisChart(selection) {
            var xAxisContainer = dataJoin(selection, [selection.datum()])
                .layout({
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    height: xAxisHeight
                });

            selection.layout();

            xScale.range([0, xAxisContainer.layout('width')])
                .domain(selection.datum().viewDomain);

            xAxisContainer.call(xAxis);
        }

        return xAxisChart;
    };
})(d3, fc, sc);