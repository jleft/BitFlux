(function(d3, fc, sc) {
    'use strict';

    sc.chart.macd = function() {
        var dispatch = d3.dispatch('viewChange');

        var macdAlgorithm = fc.indicator.algorithm.macd();

        var macdRenderer = fc.indicator.renderer.macd();

        function macd(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            macdAlgorithm(data);

            var maxYExtent = d3.max(data, function(d) {
                return Math.abs(d.macd.macd);
            });

            macdRenderer.xScale()
                .domain(viewDomain)
                .range([0, fc.util.innerDimensions(selection.node()).width]);
            macdRenderer.yScale()
                .domain([-maxYExtent, maxYExtent])
                .range([fc.util.innerDimensions(selection.node()).height, 0]);


            var zoom = d3.behavior.zoom();
            zoom.x(macdRenderer.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection, data, macdRenderer.xScale());
                    dispatch.viewChange(macdRenderer.xScale().domain());
                });

            selection.call(zoom);
            selection.datum(data)
                .call(macdRenderer);
        }

        d3.rebind(macd, dispatch, 'on');

        return macd;
    };

})(d3, fc, sc);