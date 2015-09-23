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

        var xScale = fc.scale.dateTime();

        var rsiChart = fc.chart.cartesianChart(xScale, d3.scale.linear())
            .xTicks(0)
            .yOrient('right')
            .yTickValues(tickValues)
            .margin({
                top: 0,
                left: 0,
                bottom: 0,
                right: yAxisWidth
            });

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

        function rsi(selection) {
            var model = selection.datum();

            rsiAlgorithm(model.data);

            rsiChart.xDomain(model.viewDomain)
                .yDomain([0, 100]);

            // Redraw
            rsiChart.plotArea(multi);
            selection.call(rsiChart);

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');

            var zoom = sc.behavior.zoom()
                .scale(xScale)
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