(function(sc) {
    'use strict';


    sc.chart.xAxis = function() {
        var dispatch = d3.dispatch('viewChange');

        function xAxisChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            var xAxisHeight = 20;
            var xScale = fc.scale.dateTime()
                .domain(viewDomain);
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(6);

            var sharedXAxis = (function() {

                var sharedXAxis = function() {

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

                sharedXAxis.xScale = function() { return xScale; };

                return sharedXAxis;
            })();

            // Redraw
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