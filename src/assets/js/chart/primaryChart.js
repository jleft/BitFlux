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

    function findTotalYExtent(visibleData, data, currentSeries, indicator) {
        var extentAccessor;
        if (currentSeries.option.yLowValue && currentSeries.option.yHighValue) {
            extentAccessor = [currentSeries.option.yLowValue(), currentSeries.option.yHighValue()];
        } else if (currentSeries.option.yValue) {
            extentAccessor = currentSeries.option.yValue();
        } else if (currentSeries.option.y1Value) {
            extentAccessor = currentSeries.option.y1Value();
        } else {
            throw new Error('Main series given to chart does not have expected interface');
        }
        var extent = fc.util.extent(visibleData, extentAccessor);

        var bollingerBandsVisibleDataObject = data.map(function(d) { return d.bollingerBands; });
        var bollingerBandsExtent = fc.util.extent(bollingerBandsVisibleDataObject, ['lower', 'upper']);
        extent[0] = Math.min(bollingerBandsExtent[0], extent[0]);
        extent[1] = Math.max(bollingerBandsExtent[1], extent[1]);
        return extent;
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

        var currentSeries = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());

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

        var indMulti = fc.series.multi();

        function updateMultiSeries() {
            if (indMulti.series()) {
                multi.series([gridlines, currentSeries.option, closeLine, indMulti]);
            } else {
                multi.series([gridlines, currentSeries.option, closeLine]);
            }
        }

        function primaryChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            timeSeries.xDomain(viewDomain);

            var visibleData = sc.util.filterDataInDateRange(data, timeSeries.xDomain());

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

            // Scale y axis
            var yExtent = findTotalYExtent(visibleData, data, currentSeries, indMulti.series());
            // Add 10% either side of extreme high/lows
            var variance = yExtent[1] - yExtent[0];
            yExtent[0] -= variance * 0.1;
            yExtent[1] += variance * 0.1;
            timeSeries.yDomain(yExtent);

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

        primaryChart.yAxisWidth = function() { return timeSeries.yAxisWidth; };

        primaryChart.changeSeries = function(series) {
            currentSeries = series;
            return primaryChart;
        };

        primaryChart.toggleIndicator = function(indicator) {
            var ind = indMulti.series();
            if (indicator.show) {
                ind.push(indicator.option);
                indMulti.series(ind);
            } else {
                var index = ind.indexOf(indicator.option);
                ind.splice(index, 1);
                indMulti.series(ind);
            }
            updateMultiSeries();
            return primaryChart;
        };

        return primaryChart;
    };
})(d3, fc, sc);
