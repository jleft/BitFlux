(function(d3, fc, sc) {
    'use strict';

    sc.chart.secondary = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);
        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var trackingLatest = true;
        var yAxisWidth = 60;

        var foreground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        var multi = fc.series.multi();
        var chart = fc.chart.cartesian(xScale, yScale)
            .plotArea(multi)
            .xTicks(0)
            .yOrient('right')
            .margin({
                top: 0,
                left: 0,
                bottom: 0,
                right: yAxisWidth
            });

        function secondary(selection) {
            selection.each(function(data) {
                var container = d3.select(this)
                    .call(chart)
                    .call(foreground);

                var zoom = sc.behavior.zoom()
                    .scale(xScale)
                    .trackingLatest(trackingLatest)
                    .on('zoom', function(domain) {
                        dispatch[sc.event.viewChange](domain);
                    });

                container.select('rect.foreground')
                    .datum({data: selection.datum()})
                    .call(zoom);
            });
        }

        secondary.trackingLatest = function(x) {
            if (!arguments.length) {
                return trackingLatest;
            }
            trackingLatest = x;
            return secondary;
        };

        d3.rebind(secondary, dispatch, 'on');
        d3.rebind(secondary, multi, 'series', 'mapping', 'decorate');
        d3.rebind(secondary, chart, 'yTickValues', 'yTickFormat', 'xDomain', 'yDomain');

        return secondary;
    };
})(d3, fc, sc);
