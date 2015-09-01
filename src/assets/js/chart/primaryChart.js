(function(d3, fc, sc) {
    'use strict';

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

    sc.chart.primaryChart = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch('viewChange');

        var priceFormat = d3.format('.2f');

        var timeSeries = fc.chart.linearTimeSeries()
            .xAxisHeight(0)
            .yAxisWidth(yAxisWidth)
            .yOrient('right')
            .yTickFormat(priceFormat);

        var gridlines = fc.annotation.gridline()
            .yTicks(5)
            .xTicks(0);

        var currentSeries = sc.series.candlestick();
        var currentIndicator;

        // Create and apply the Moving Average
        var movingAverage = fc.indicator.algorithm.movingAverage();

        var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

        var closeLine = fc.annotation.line()
            .orient('horizontal')
            .value(function(d) { return d.close; })
            .label('');

        var multi = fc.series.multi()
            .key(function(series, index) {
                if (series.isLine) {
                    return index;
                }
                return series;
            });

        function findLinearDifference(values) {
            var arrayDifference = [values[1] - values[0]];
            for (var i = 2; i < values.length; i++) {
                arrayDifference.push(values[i] - values[i - 1]);
                if (arrayDifference[i - 1] === arrayDifference[i - 2]) {
                    return arrayDifference[i - 2];
                }
            }
        }

        function primaryChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            timeSeries.xDomain(viewDomain);

            // Scale y axis
            var yExtent = fc.util.extent(sc.util.filterDataInDateRange(data, timeSeries.xDomain()), ['low', 'high']);
            // Add 10% either side of extreme high/lows
            var variance = yExtent[1] - yExtent[0];
            yExtent[0] -= variance * 0.1;
            yExtent[1] += variance * 0.1;
            timeSeries.yDomain(yExtent);


            // Find current tick values and add close price to this list, then set it explicitly below
            var yScale = timeSeries.yScale();
            var tickValues = yScale.ticks.apply(yScale, []);

            var linearTickDifference = findLinearDifference(tickValues);

            // Removes values that are within a percentage of the close price to aid clarity of axis
            for (var i = 0; i < tickValues.length; i++) {
                var percentageDifference = Math.abs(tickValues[i] - data[data.length - 1].close) /
                    linearTickDifference;
                if (percentageDifference <= 0.1) {
                    tickValues.splice(i, 1);
                }
            }
            tickValues.push(data[data.length - 1].close);

            timeSeries.yTickValues(tickValues)
                .yDecorate(function(s) {
                    s.classed('closeLine', function(d) {
                            return d === data[data.length - 1].close;
                        })
                        .select('path').attr('d', function(d) {
                            if (d === data[data.length - 1].close) {
                                return d3.svg.area()(calculateCloseAxisTagPath(yAxisWidth, 14));
                            }
                        });
                });

            movingAverage(data);
            bollingerAlgorithm(data);

            updateMultiSeries();

            multi.mapping(function(series) {
                switch (series) {
                    case closeLine:
                        return [data[data.length - 1]];
                    default:
                        return data;
                }
            });

            // Redraw
            timeSeries.plotArea(multi);
            selection.call(timeSeries);

            // Behaves oddly if not reinitialized every render
            var zoom = d3.behavior.zoom();
            zoom.x(timeSeries.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection.select('.plot-area'), data, timeSeries.xScale());
                    dispatch.viewChange(timeSeries.xDomain());
                });

            selection.call(zoom);
        }

        d3.rebind(primaryChart, dispatch, 'on');

        function updateMultiSeries() {
            if (currentIndicator) {
                multi.series([gridlines, currentSeries, closeLine, currentIndicator]);
            } else {
                multi.series([gridlines, currentSeries, closeLine]);
            }
        }

        primaryChart.yAxisWidth = function() { return timeSeries.yAxisWidth; };

        primaryChart.changeSeries = function(series) {
            currentSeries = series;
            updateMultiSeries();
            return primaryChart;
        };

        primaryChart.changeIndicator = function(indicator) {
            currentIndicator = indicator;
            updateMultiSeries();
            return primaryChart;
        };

        return primaryChart;
    };
})(d3, fc, sc);
