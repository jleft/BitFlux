(function(sc) {
    'use strict';
    // Helper functions
    function calculateCloseAxisTagPath(width, height) {
        var h2 = height / 2;
        return [
            [0, 0],
            [h2, -h2],
            [width, -h2],
            [width, h2],
            [h2, h2],
            [0, 0]
        ];
    }

    function positionCloseAxis(sel) {
        sel.enter()
            .select('.right-handle')
            .insert('path', ':first-child')
            .attr('transform', 'translate(' + -40 + ', 0)')
            .attr('d', d3.svg.area()(calculateCloseAxisTagPath(40, 14)));

        sel.select('text')
            .attr('transform', 'translate(' + (-2) + ', ' + 2 + ')')
            .attr('x', 0)
            .attr('y', 0);
    }

    sc.chart.primaryChart = function() {
        var timeSeries = fc.chart.linearTimeSeries()
            .xTicks(6);

        var gridlines = fc.annotation.gridline()
            .yTicks(5)
            .xTicks(0);

        // Create and apply the Moving Average
        var movingAverage = fc.indicator.algorithm.movingAverage();

        // Create a line that renders the result
        var movingAverageLine = fc.series.line()
            .decorate(function(selection) {
                selection.enter()
                    .classed('ma', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        var priceFormat = d3.format('.2f');

        var closeAxisAnnotation = fc.annotation.line()
            .orient('horizontal')
            .value(function(d) { return d.close; })
            .label(function(d) { return priceFormat(d.close); })
            .decorate(function(sel) {
                positionCloseAxis(sel);
                sel.enter().classed('close', true);
            });

        var multi = fc.series.multi()
            .series([gridlines, movingAverageLine, closeAxisAnnotation])
            .key(function(series, index) {
                if (series.isLine) {
                    return index;
                }
                return series;
            });

        function primaryChart(selection) {
            var data = selection.datum();
            timeSeries.xDomain(data.viewDomain);

            movingAverage(data);

            multi.mapping(function(series) {
                switch (series) {
                    case closeAxisAnnotation:
                        return [data[data.length - 1]];
                    default:
                        return data;
                }
            });

            // Scale y axis
            var yExtent = fc.util.extent(sc.util.filterDataInDateRange(data, timeSeries.xDomain()), ['low', 'high']);
            // Add 10% either side of extreme high/lows
            var variance = yExtent[1] - yExtent[0];
            yExtent[0] -= variance * 0.1;
            yExtent[1] += variance * 0.1;
            timeSeries.yDomain(yExtent);

            // Redraw
            timeSeries.plotArea(multi);
            selection.call(timeSeries);

            // Behaves oddly if not reinitialized every render
            var zoom = d3.behavior.zoom();
            zoom.x(timeSeries.xScale())
                .on('zoom', sc.util.zoomControl(zoom, selection, data, timeSeries.xScale()));

            selection.call(zoom);
        }

        primaryChart.changeSeries = function(series) {
            multi.series([gridlines, movingAverageLine, series, closeAxisAnnotation]);
            return primaryChart;
        };

        d3.rebind(primaryChart, timeSeries, 'xDomain');

        return primaryChart;
    };
})(sc);