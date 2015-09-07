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

    function findTotalYExtent(visibleData, currentSeries, currentIndicators) {
        var extentAccessor;
        switch (currentSeries.valueString) {
            case 'candlestick':
            case 'ohlc':
                extentAccessor = [currentSeries.option.yLowValue(), currentSeries.option.yHighValue()];
                break;
            case 'line':
            case 'point':
                extentAccessor = currentSeries.option.yValue();
                break;
            case 'area' :
                extentAccessor = currentSeries.option.y1Value();
                break;
            default:
                throw new Error('Main series given to chart does not have expected interface');
        }
        var extent = fc.util.extent(visibleData, extentAccessor);

        if (currentIndicators.length) {
            var indicators = currentIndicators.map(function(indicator) { return indicator.valueString; });
            var movingAverageShown = (indicators.indexOf('movingAverage') !== -1);
            var bollingerBandsShown = (indicators.indexOf('bollinger') !== -1);
            if (bollingerBandsShown) {
                var bollingerBandsVisibleDataObject = visibleData.map(function(d) { return d.bollingerBands; });
                var bollingerBandsExtent = fc.util.extent(bollingerBandsVisibleDataObject, ['lower', 'upper']);
                extent[0] = Math.min(bollingerBandsExtent[0], extent[0]);
                extent[1] = Math.max(bollingerBandsExtent[1], extent[1]);
            }
            if (movingAverageShown) {
                var movingAverageExtent = fc.util.extent(visibleData, 'movingAverage');
                extent[0] = Math.min(movingAverageExtent[0], extent[0]);
                extent[1] = Math.max(movingAverageExtent[1], extent[1]);
            }
            if (!(movingAverageShown || bollingerBandsShown)) {
                throw new Error('Unexpected indicator type');
            }
        }
        return extent;
    }

    sc.chart.primary = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch('viewChange');

        var currentSeries = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        var currentYValueAccessor = function(d) { return d.close; };
        var currentIndicators = [];

        var gridlines = fc.annotation.gridline()
            .yTicks(5)
            .xTicks(0);
        var closeLine = fc.annotation.line()
            .orient('horizontal')
            .value(currentYValueAccessor)
            .label('');

        var multi = fc.series.multi()
            .key(function(series, index) {
                if (series.isLine) {
                    return index;
                }
                return series;
            })
            .series([gridlines, currentSeries.option, closeLine])
            .mapping(function(series) {
                switch (series) {
                    case closeLine:
                        return [this.data[this.data.length - 1]];
                    default:
                        return this.data;
                }
            });

        var priceFormat = d3.format('.2f');

        var timeSeries = fc.chart.linearTimeSeries()
            .xAxisHeight(0)
            .yAxisWidth(yAxisWidth)
            .yOrient('right')
            .yTickFormat(priceFormat);

        // Create and apply the Moving Average
        var movingAverage = fc.indicator.algorithm.movingAverage();
        var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

        function updateMultiSeries() {
            var baseChart = [gridlines, currentSeries.option, closeLine];
            var indicators = currentIndicators.map(function(indicator) { return indicator.option; });
            multi.series(baseChart.concat(indicators));
        }

        function updateYValueAccessorUsed() {
            movingAverage.value(currentYValueAccessor);
            bollingerAlgorithm.value(currentYValueAccessor);
            closeLine.value(currentYValueAccessor);
            switch (currentSeries.valueString) {
                case 'line':
                case 'point':
                case 'area':
                    currentSeries.option.yValue(currentYValueAccessor);
                    break;
                default:
                    break;
            }
        }

        function primary(selection) {
            var dataModel = selection.datum();

            timeSeries.xDomain(dataModel.viewDomain);

            updateYValueAccessorUsed();
            updateMultiSeries();

            movingAverage(dataModel.data);
            bollingerAlgorithm(dataModel.data);

            var visibleData = sc.util.domain.filterDataInDateRange(timeSeries.xDomain(), data);

            // Scale y axis
            var visibleData = sc.util.domain.filterDataInDateRange(timeSeries.xDomain(), dataModel.data);
            var yExtent = findTotalYExtent(visibleData, currentSeries, currentIndicators);
            // Add percentage padding either side of extreme high/lows
            var paddedYExtent = sc.util.domain.padYDomain(yExtent, 0.04);
            timeSeries.yDomain(paddedYExtent);

            // Find current tick values and add close price to this list, then set it explicitly below
            var latestPrice = currentYValueAccessor(dataModel.data[dataModel.data.length - 1]);
            var tickValues = produceAnnotatedTickValues(timeSeries.yScale(), [latestPrice]);
            timeSeries.yTickValues(tickValues)
                .yDecorate(function(s) {
                    s.filter(function(d) { return d === latestPrice; })
                        .classed('closeLine', true)
                        .select('path')
                        .attr('d', function(d) {
                            return d3.svg.area()(calculateCloseAxisTagPath(yAxisWidth, 14));
                        });
                });

            // Redraw
            timeSeries.plotArea(multi);
            selection.call(timeSeries);

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
            zoom.x(timeSeries.xScale())
                .on('zoom', function() {
                    sc.util.zoomControl(zoom, selection.select('rect.foreground'), timeSeries.xScale());
                    dispatch.viewChange(timeSeries.xDomain());
                });

            selection.select('rect.foreground').call(zoom);
        }

        d3.rebind(primary, dispatch, 'on');

        primary.changeSeries = function(series) {
            currentSeries = series;
            return primary;
        };

        primary.changeYValueAccessor = function(yValueAccessor) {
            currentYValueAccessor = yValueAccessor.option;
            return primary;
        };

        primary.toggleIndicator = function(indicator) {
            if (currentIndicators.indexOf(indicator.option) !== -1 && !indicator.toggled) {
                currentIndicators.splice(currentIndicators.indexOf(indicator.option), 1);
            } else if (indicator.toggled) {
                currentIndicators.push(indicator.option);
            }
            return primary;
        };

        return primary;
    };
})(d3, fc, sc);