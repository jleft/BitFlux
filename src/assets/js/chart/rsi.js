(function(d3, fc, sc) {
    'use strict';

    sc.chart.rsi = function() {
        var dispatch = d3.dispatch('viewChange');

        var rsiScale = d3.scale.linear()
            .domain([0, 100]);

        var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

        var rsiRenderer = fc.indicator.renderer.relativeStrengthIndex()
            .yScale(rsiScale);

        function rsi(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            rsiRenderer.xScale()
                .domain(viewDomain)
                .range([0, fc.util.innerDimensions(selection.node()).width]);
            rsiRenderer.yScale().range([fc.util.innerDimensions(selection.node()).height, 0]);

            rsiAlgorithm(data);

            var zoom = d3.behavior.zoom();
            zoom.x(rsiRenderer.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection, data, rsiRenderer.xScale());
                    dispatch.viewChange(rsiRenderer.xScale().domain());
                });

            selection.call(zoom);
            selection.datum(data)
                .call(rsiRenderer);
        }

        d3.rebind(rsi, dispatch, 'on');

        return rsi;
    };

})(d3, fc, sc);