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
            var dataModel = selection.datum();

            rsiAlgorithm(dataModel.data);

            rsiTimeSeries.xDomain(dataModel.viewDomain)
                .yDomain([0, 100]);

            // Redraw
            rsiTimeSeries.plotArea(multi);
            selection.call(rsiTimeSeries);

            selection.selectAll('rect.foreground')
                .data([dataModel])
                .enter()
                .append('rect')
                .attr('class', 'foreground')
                .layout({
                    position: 'absolute',
                    top: 0,
                    right: yAxisWidth,
                    bottom: 0,
                    left: 0
                });

            selection.layout();

            // Behaves oddly if not reinitialized every render
            var zoom = d3.behavior.zoom();
            zoom.x(rsiTimeSeries.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection.select('rect.foreground'), rsiTimeSeries.xScale());
                    dispatch.viewChange(rsiTimeSeries.xDomain());
                });

            selection.select('rect.foreground').call(zoom);
        }

        d3.rebind(rsi, dispatch, 'on');

        return rsi;
    };
})(d3, fc, sc);