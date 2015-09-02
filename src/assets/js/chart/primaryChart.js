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

    function produceAnnotatedTickValues(scale, annotation) {
        var annotatedTickValues = scale.ticks.apply(scale, []);

        var extent = scale.domain();
        for (var i = 0; i < annotation.length; i++) {
            if (annotation[i] > extent[0] && annotation[i] < extent[1]) {
                annotatedTickValues.push(annotation[i]);
            }
        }

        return annotatedTickValues;
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
            })
            .series([gridlines, currentSeries, closeLine]);

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
            var closePrice = data[data.length - 1].close;
            var tickValues = produceAnnotatedTickValues(timeSeries.yScale(), [closePrice]);

            timeSeries.yTickValues(tickValues)
                .yDecorate(function(s) {
                    s.classed('closeLine', function(d) {
                            return d === closePrice;
                        })
                        .select('path').attr('d', function(d) {
                            if (d === closePrice) {
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
