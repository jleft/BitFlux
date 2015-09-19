(function(d3, fc, sc) {
    'use strict';

    sc.chart.macd = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch('viewChange');

        var zero = fc.annotation.line()
            .value(0)
            .label('');
        var macdRenderer = fc.indicator.renderer.macd();
        var multi = fc.series.multi()
            .series([zero, macdRenderer])
            .mapping(function(series) {
                if (series === zero) {
                    return [0];
                }
                return this.data;
            })
            .decorate(function(g) {
                g.enter()
                    .attr('class', function(d, i) {
                        return ['multi zero', 'multi'][i];
                    });
            });

        var macdTimeSeries = fc.chart.linearTimeSeries()
            .xAxisHeight(0)
            .yAxisWidth(yAxisWidth)
            .yOrient('right');

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        var macdAlgorithm = fc.indicator.algorithm.macd();

        function macd(selection) {
            var model = selection.datum();

            macdAlgorithm(model.data);

            macdTimeSeries.xDomain(model.viewDomain);

            // Add percentage padding either side of extreme high/lows
            var maxYExtent = d3.max(model.data, function(d) {
                return Math.abs(d.macd.macd);
            });
            var paddedYExtent = sc.util.domain.padYDomain([-maxYExtent, maxYExtent], 0.04);
            macdTimeSeries.yDomain(paddedYExtent);

            // Redraw
            macdTimeSeries.plotArea(multi);
            selection.call(macdTimeSeries);

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');


            var zoom = sc.behavior.zoom()
                .scale(macdTimeSeries.xScale())
                .trackingLatest(selection.datum().trackingLatest)
                .on('zoom', function(domain) {
                    dispatch.viewChange(domain);
                });
            foreground.call(zoom);
        }

        d3.rebind(macd, dispatch, 'on');

        return macd;
    };
})(d3, fc, sc);