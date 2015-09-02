(function(sc) {
    'use strict';

    sc.chart.xAxis = function() {
        var dispatch = d3.dispatch('viewChange');

        var xAxisHeight = 20;
        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(6);

        function xAxisChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            var zoom = d3.behavior.zoom();

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

            // Behaves oddly if not reinitialized every render
            zoom.x(xScale)
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection, data, xScale);
                    dispatch.viewChange(xScale.domain());
                });

            selection.call(zoom);
        }

        d3.rebind(xAxisChart, dispatch, 'on');

        return xAxisChart;
    };
})(sc);