(function(sc) {
    'use strict';

    var drawXAxis = function() {

        var xAxisHeight = 20;
        var plotArea = fc.series.line();
        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(6);

        var drawXAxis = function(selection) {

            var data = selection.datum().data;

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

            xScale.range([0, xAxisContainer.layout('width')]);

            xAxisContainer.call(xAxis);
        };

        drawXAxis.xAxis = function() { return xAxis; };
        drawXAxis.xScale = function() { return xScale; };
        drawXAxis.plotArea = function(x) {
            if (!arguments.length) {
                return plotArea;
            }
            plotArea = x;
            return drawXAxis;
        };

        return drawXAxis;
    };

    sc.chart.xAxisChart = function() {
        var dispatch = d3.dispatch('viewChange');

        var sharedXAxis = drawXAxis();

        var xAxisMulti = fc.series.multi();

        function xAxisChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            sharedXAxis.xScale()
                .domain(viewDomain);

            // Redraw
            sharedXAxis.plotArea(xAxisMulti);
            selection.call(sharedXAxis);

            // Behaves oddly if not reinitialized every render
            var zoom = d3.behavior.zoom();
            zoom.x(sharedXAxis.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection, data, sharedXAxis.xScale());
                    dispatch.viewChange(sharedXAxis.xScale().domain());
                });

            selection.call(zoom);
        }

        d3.rebind(xAxisChart, dispatch, 'on');

        return xAxisChart;
    };
})(sc);