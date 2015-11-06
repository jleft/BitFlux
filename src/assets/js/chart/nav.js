(function(d3, fc, sc) {
    'use strict';

    sc.chart.nav = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);

        var navChart = fc.chart.cartesian(fc.scale.dateTime(), d3.scale.linear())
            .yTicks(0)
            .margin({
                top: 0,
                left: 0,
                bottom: 30,
                right: 0
            });

        var viewScale = fc.scale.dateTime();

        var area = fc.series.area()
            .yValue(function(d) { return d.close; });
        var line = fc.series.line()
            .yValue(function(d) { return d.close; });
        var brush = d3.svg.brush();
        var navMulti = fc.series.multi().series([area, line, brush])
            .mapping(function(series) {
                if (series === brush) {
                    brush.extent([
                        [viewScale.domain()[0], navChart.yDomain()[0]],
                        [viewScale.domain()[1], navChart.yDomain()[1]]
                    ]);
                }
                return this.data;
            });
        var layoutWidth;

        function nav(selection) {
            var model = selection.datum();

            viewScale.domain(model.viewDomain);

            var yExtent = fc.util.extent(
                sc.util.domain.filterDataInDateRange(fc.util.extent(model.data, 'date'), model.data),
                ['low', 'high']);

            navChart.xDomain(fc.util.extent(model.data, 'date'))
                .yDomain(yExtent);

            brush.on('brush', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] !== 0) {
                    dispatch[sc.event.viewChange]([brush.extent()[0][0], brush.extent()[1][0]]);
                }
            })
            .on('brushend', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] === 0) {
                    dispatch[sc.event.viewChange](sc.util.domain.centerOnDate(viewScale.domain(),
                        model.data, brush.extent()[0][0]));
                }
            });

            navChart.plotArea(navMulti);
            selection.call(navChart);

            // Allow to zoom using mouse, but disable panning
            var zoom = sc.behavior.zoom(layoutWidth)
                .scale(viewScale)
                .trackingLatest(model.trackingLatest)
                .allowPan(false)
                .on('zoom', function(domain) {
                    dispatch[sc.event.viewChange](domain);
                });

            selection.select('.plot-area').call(zoom);
        }

        d3.rebind(nav, dispatch, 'on');

        return nav;
    };
})(d3, fc, sc);
