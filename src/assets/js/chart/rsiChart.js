(function(sc) {
    'use strict';
    // Helper functions
    sc.chart.rsiChart = function() {
        var rsiScale = d3.scale.linear()
            .domain([0, 100]);

        var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

        var rsi = fc.indicator.renderer.relativeStrengthIndex()
            .yScale(rsiScale);

        function rsiChart(selection) {
            var data = selection.datum();

            rsi.xScale()
                .domain(data.viewDomain)
                .range([0, selection.attr('width')]);
            rsi.yScale().range([parseInt(d3.select('svg.rsi').style('height'), 10), 0]);

            rsiAlgorithm(data);

            var zoom = d3.behavior.zoom();
            zoom.x(rsi.xScale())
                .on('zoom', sc.zoomCall(zoom, data, rsi.xScale()));

            selection.call(zoom);
            selection.call(rsi);
        }

        return rsiChart;
    };

})(sc);