(function(sc) {
    'use strict';
    // Helper functions
    sc.chart.macdChart = function() {
        var dispatch = d3.dispatch('viewChange');

        var macdAlgorithm = fc.indicator.algorithm.macd();

        var macd = fc.indicator.renderer.macd();

        function macdChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            macdAlgorithm(data);

            var maxYExtent = d3.max(data, function(d) {
                return Math.abs(d.macd.macd);
            });

            macd.xScale()
                .domain(viewDomain)
                .range([0, parseInt(selection.style('width'), 10)]);
            macd.yScale()
                .domain([-maxYExtent, maxYExtent])
                .range([parseInt(selection.style('height'), 10), 0]);


            var zoom = d3.behavior.zoom();
            zoom.x(macd.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection, data, macd.xScale());
                    dispatch.viewChange(macd.xScale().domain());
                });

            selection.call(zoom);
            selection.datum(data)
                .call(macd);
        }

        d3.rebind(macdChart, dispatch, 'on');

        return macdChart;
    };

})(sc);