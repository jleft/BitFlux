(function(sc) {
    'use strict';
    // Helper functions
    sc.chart.navChart = function() {
        var dispatch = d3.dispatch('viewChange');

        var navTimeSeries = fc.chart.linearTimeSeries()
            .yTicks(0);

        var area = fc.series.area()
            .yValue(function(d) { return d.open; });

        var line = fc.series.line()
            .yValue(function(d) { return d.open; });

        var brush = d3.svg.brush();

        var navMulti = fc.series.multi().series([area, line, brush]);

        var viewScale = fc.scale.dateTime();

        function navChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            viewScale.domain(viewDomain)
                .range([0, selection.attr('width')]);

            var yExtent = fc.util.extent(sc.util.filterDataInDateRange(data,
                fc.util.extent(data, 'date')), ['low', 'high']);

            navTimeSeries.xDomain(fc.util.extent(data, 'date'))
                .yDomain(yExtent);

            brush.on('brush', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] !== 0) {
                    // Control the shared view scale's domain
                    dispatch.viewChange([brush.extent()[0][0], brush.extent()[1][0]]);
                }
            });

            // Allow to zoom using mouse, but disable panning
            var zoom = d3.behavior.zoom();
            zoom.x(viewScale)
                .on('zoom', function() {
                    if (zoom.scale() === 1) {
                        zoom.translate([0, 0]);
                    } else {
                        // Usual behavior
                        sc.util.zoomControl(zoom, selection, data, viewScale);
                        dispatch.viewChange(viewScale.domain());
                    }
                });
            selection.call(zoom);


            navMulti.mapping(function(series) {
                if (series === brush) {
                    brush.extent([
                        [viewScale.domain()[0], navTimeSeries.yDomain()[0]],
                        [viewScale.domain()[1], navTimeSeries.yDomain()[1]]
                    ]);
                }
                return data;
            });

            navTimeSeries.plotArea(navMulti);
            selection.call(navTimeSeries);
        }

        d3.rebind(navChart, dispatch, 'on');

        return navChart;
    };

})(sc);