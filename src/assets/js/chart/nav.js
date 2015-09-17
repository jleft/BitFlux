(function(d3, fc, sc) {
    'use strict';

    sc.chart.nav = function() {
        var dispatch = d3.dispatch('viewChange');

        var navTimeSeries = fc.chart.linearTimeSeries()
            .yTicks(0)
            .yOrient('right');

        var viewScale = fc.scale.dateTime();

        var area = fc.series.area()
            .yValue(function(d) { return d.open; });
        var line = fc.series.line()
            .yValue(function(d) { return d.open; });
        var brush = d3.svg.brush();
        var navMulti = fc.series.multi().series([area, line, brush])
            .mapping(function(series) {
                if (series === brush) {
                    brush.extent([
                        [viewScale.domain()[0], navTimeSeries.yDomain()[0]],
                        [viewScale.domain()[1], navTimeSeries.yDomain()[1]]
                    ]);
                }
                return this.data;
            });

        function nav(selection) {
            var dataModel = selection.datum();

            viewScale.domain(dataModel.viewDomain)
                .range([0, fc.util.innerDimensions(selection.node()).width]);

            var yExtent = fc.util.extent(
                sc.util.domain.filterDataInDateRange(fc.util.extent(dataModel.data, 'date'), dataModel.data),
                ['low', 'high']);

            navTimeSeries.xDomain(fc.util.extent(dataModel.data, 'date'))
                .yDomain(yExtent);

            brush.on('brush', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] !== 0) {
                    // Control the shared view scale's domain
                    dispatch.viewChange([brush.extent()[0][0], brush.extent()[1][0]]);
                }
            });

            navTimeSeries.plotArea(navMulti);
            selection.call(navTimeSeries);

            // Allow to zoom using mouse, but disable panning
            var zoom = d3.behavior.zoom();
            zoom.x(viewScale)
                .on('zoom', function() {
                    if (zoom.scale() !== 1) {
                        sc.util.zoomControl(zoom, selection, viewScale);
                        dispatch.viewChange(viewScale.domain());
                    }
                });
            selection.call(zoom);
        }

        d3.rebind(nav, dispatch, 'on');

        return nav;
    };

})(d3, fc, sc);