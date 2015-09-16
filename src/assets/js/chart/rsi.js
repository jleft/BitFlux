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

        var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

        function rsi(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            rsiTimeSeries.xDomain(viewDomain)
                .yDomain([0, 100]);

            rsiAlgorithm(data);

            // Redraw
            rsiTimeSeries.plotArea(multi);
            selection.call(rsiTimeSeries);

            // Behaves oddly if not reinitialized every render
            var zoom = d3.behavior.zoom();
            zoom.x(rsiTimeSeries.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection.select('.plot-area'), data, rsiTimeSeries.xScale());
                    dispatch.viewChange(rsiTimeSeries.xDomain());
                });

            selection.call(zoom);
        }

        d3.rebind(rsi, dispatch, 'on');

        return rsi;
    };
})(d3, fc, sc);