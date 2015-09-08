(function(d3, fc, sc) {
    'use strict';

    sc.chart.rsiChart = function() {
        var dispatch = d3.dispatch('viewChange');

        var rsiScale = d3.scale.linear()
            .domain([0, 100]);

        var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

        var rsi = fc.indicator.renderer.relativeStrengthIndex()
            .yScale(rsiScale);

        function rsiChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            rsi.xScale()
                .domain(viewDomain)
                .range([0, parseInt(selection.style('width'), 10)]);
            rsi.yScale().range([parseInt(selection.style('height'), 10), 0]);

            rsiAlgorithm(data);

            var zoom = d3.behavior.zoom();
            zoom.x(rsi.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection, data, rsi.xScale());
                    dispatch.viewChange(rsi.xScale().domain());
                });

            selection.call(zoom);
            selection.datum(data)
                .call(rsi);
        }

        d3.rebind(rsiChart, dispatch, 'on');

        return rsiChart;
    };

})(d3, fc, sc);