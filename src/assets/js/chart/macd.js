(function(d3, fc, sc) {
    'use strict';

    sc.chart.macd = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch(sc.event.viewChange);

        var xScale = fc.scale.dateTime();

        var macdChart = fc.chart.cartesianChart(xScale, d3.scale.linear())
            .xTicks(0)
            .yOrient('right')
            .margin({
                top: 0,
                left: 0,
                bottom: 0,
                right: yAxisWidth
            });

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

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        var macdAlgorithm = fc.indicator.algorithm.macd();

        function macd(selection) {
            var model = selection.datum();

            macdAlgorithm(model.data);

            macdChart.xDomain(model.viewDomain);

            // Add percentage padding either side of extreme high/lows
            var maxYExtent = d3.max(model.data, function(d) {
                return Math.abs(d.macd.macd);
            });
            var paddedYExtent = sc.util.domain.padYDomain([-maxYExtent, maxYExtent], 0.04);
            macdChart.yDomain(paddedYExtent);

            // Redraw
            macdChart.plotArea(multi);
            selection.call(macdChart);

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');

            var zoom = sc.behavior.zoom()
                .scale(xScale)
                .trackingLatest(model.trackingLatest)
                .on('zoom', function(domain) {
                    dispatch[sc.event.viewChange](domain);
                });
            foreground.call(zoom);
        }

        d3.rebind(macd, dispatch, 'on');

        return macd;
    };
})(d3, fc, sc);
