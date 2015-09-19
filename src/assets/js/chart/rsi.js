(function(d3, fc, sc) {
    'use strict';

    sc.chart.rsi = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch('viewChange');

        var rsiRenderer = fc.indicator.renderer.relativeStrengthIndex();
        var multi = fc.series.multi()
            .series([rsiRenderer])
            .mapping(function() { return this.data; });

        var tickValues = [rsiRenderer.lowerValue(), 50, rsiRenderer.upperValue()];

        var rsiTimeSeries = fc.chart.linearTimeSeries()
            .xAxisHeight(0)
            .yAxisWidth(yAxisWidth)
            .yOrient('right')
            .yTickValues(tickValues);

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

        function rsi(selection) {
            var model = selection.datum();

            rsiAlgorithm(model.data);

            rsiTimeSeries.xDomain(model.viewDomain)
                .yDomain([0, 100]);

            // Redraw
            rsiTimeSeries.plotArea(multi);
            selection.call(rsiTimeSeries);

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');


            var zoom = sc.behavior.zoom()
                .scale(rsiTimeSeries.xScale())
                .trackingLatest(selection.datum().trackingLatest)
                .on('zoom', function(domain) {
                    dispatch.viewChange(domain);
                });
            foreground.call(zoom);
        }

        d3.rebind(rsi, dispatch, 'on');

        return rsi;
    };
})(d3, fc, sc);