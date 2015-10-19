(function(d3, fc, sc) {
    'use strict';

    function formatVolume(x) { return sc.model.selectedProduct.volumeFormat(x); }

    sc.chart.volume = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch(sc.event.viewChange);

        var xScale = fc.scale.dateTime();

        var volumeChart = fc.chart.cartesianChart(xScale, d3.scale.linear())
            .xTicks(0)
            .yOrient('right')
            .yTickFormat(formatVolume)
            .margin({
                top: 0,
                left: 0,
                bottom: 0,
                right: yAxisWidth
            });

        var volumeBar = fc.series.bar()
            .yValue(function(d) { return d.volume; });
        var multi = fc.series.multi()
            .series([volumeBar])
            .mapping(function(series) {
                return this.data;
            });

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        function volume(selection) {
            var model = selection.datum();

            volumeChart.xDomain(model.viewDomain);

            // Add percentage padding either side of extreme high/lows
            var maxYExtent = d3.max(model.data, function(d) {
                return d3.max([d.volume]);
            });
            var minYExtent = d3.min(model.data, function(d) {
                return d3.min([d.volume]);
            });
            var paddedYExtent = sc.util.domain.padYDomain([minYExtent, maxYExtent], 0.04);
            volumeChart.yDomain(paddedYExtent);

            // Redraw
            volumeChart.plotArea(multi);
            selection.call(volumeChart);

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');

            // Behaves oddly if not reinitialized every render
            var zoom = sc.behavior.zoom()
                .scale(xScale)
                .trackingLatest(model.trackingLatest)
                .on('zoom', function(domain) {
                    dispatch[sc.event.viewChange](domain);
                });

            foreground.call(zoom);
        }

        d3.rebind(volume, dispatch, 'on');

        return volume;
    };
})(d3, fc, sc);
