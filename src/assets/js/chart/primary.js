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
                extent[0] = d3.min([bollingerBandsExtent[0], extent[0]]);
                extent[1] = d3.max([bollingerBandsExtent[1], extent[1]]);
            }
            if (movingAverageShown) {
                var movingAverageExtent = fc.util.extent(visibleData, 'movingAverage');
                extent[0] = d3.min([movingAverageExtent[0], extent[0]]);
                extent[1] = d3.max([movingAverageExtent[1], extent[1]]);
            }
            if (!(movingAverageShown || bollingerBandsShown)) {
                throw new Error('Unexpected indicator type');
            }
        }
        return extent;
    }

    function formatPrice(x) { return sc.model.selectedProduct.priceFormat(x); }

    sc.chart.primary = function() {

        var yAxisWidth = 45;
        var dispatch = d3.dispatch(sc.event.viewChange, sc.event.crosshairChange);

        var currentSeries = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        var currentYValueAccessor = function(d) { return d.close; };
        var currentIndicators = [];


        var crosshairData = [];
        var crosshair = fc.tool.crosshair()
             .xLabel('')
             .yLabel('');

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
            .series([gridlines, currentSeries.option, closeLine, crosshair])
            .mapping(function(series) {
                switch (series) {
                    case closeLine:
                        return [this.data[this.data.length - 1]];
                    case crosshair:
                        return crosshairData;
                    default:
                        return this.data;
                }
            });

        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();

        var primaryChart = fc.chart.cartesianChart(xScale, yScale)
            .xTicks(0)
            .yOrient('right')
            .yTickFormat(formatPrice)
            .margin({
                top: 0,
                left: 0,
                bottom: 0,
                right: yAxisWidth
            });

        // Create and apply the Moving Average
        var movingAverage = fc.indicator.algorithm.movingAverage();
        var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

        function updateMultiSeries(series) {
            var baseChart = [gridlines, currentSeries.option, closeLine];
            var indicators = currentIndicators.map(function(indicator) { return indicator.option; });
            series(baseChart.concat(indicators));
            // add crosshair last to have it on top
            series(series().concat(crosshair));
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

        function setCrosshairSnap(series, data) {
            crosshair.snap(fc.util.seriesPointSnapXOnly(series, data))
                .on('trackingmove', function(crosshairData) {
                    dispatch[sc.event.crosshairChange](crosshairData[0].datum);
                })
                .on('trackingend', function() {
                    dispatch[sc.event.crosshairChange](undefined);
                });
        }

        function changeSeries(series) {
            currentSeries = series;
        }

        function changeYValueAccessor(yValueAccessor) {
            currentYValueAccessor = yValueAccessor.option;
        }

        function toggleIndicator(indicator) {
            if (indicator) {
                if (currentIndicators.indexOf(indicator.option) !== -1 && !indicator.toggled) {
                    currentIndicators.splice(currentIndicators.indexOf(indicator.option), 1);
                } else if (indicator.toggled) {
                    currentIndicators.push(indicator.option);
                }
            }
        }

        function primary(selection) {
            var model = selection.datum();
            changeSeries(model.series);
            changeYValueAccessor(model.yValueAccessor);
            toggleIndicator(model.toggledIndicator);

            primaryChart.xDomain(model.viewDomain);

            updateYValueAccessorUsed();
            updateMultiSeries(multi.series);
            setCrosshairSnap(currentSeries.option, model.data);

            movingAverage(model.data);
            bollingerAlgorithm(model.data);

            // Scale y axis
            var visibleData = sc.util.domain.filterDataInDateRange(primaryChart.xDomain(), model.data);
            var yExtent = findTotalYExtent(visibleData, currentSeries, currentIndicators);
            // Add percentage padding either side of extreme high/lows
            var paddedYExtent = sc.util.domain.padYDomain(yExtent, 0.04);
            primaryChart.yDomain(paddedYExtent);

            // Find current tick values and add close price to this list, then set it explicitly below
            var latestPrice = currentYValueAccessor(model.data[model.data.length - 1]);
            var tickValues = produceAnnotatedTickValues(yScale, [latestPrice]);
            primaryChart.yTickValues(tickValues)
                .yDecorate(function(s) {
                    s.selectAll('.tick')
                        .filter(function(d) { return d === latestPrice; })
                        .classed('closeLine', true)
                        .select('path')
                        .attr('d', function(d) {
                            return d3.svg.area()(calculateCloseAxisTagPath(yAxisWidth, 14));
                        });
                });

            // Redraw
            primaryChart.plotArea(multi);
            selection.call(primaryChart);

            var zoom = sc.behavior.zoom()
                .scale(xScale)
                .trackingLatest(selection.datum().trackingLatest)
                .on('zoom', function(domain) {
                    dispatch[sc.event.viewChange](domain);
                });
            selection.select('.plot-area')
                .call(zoom);
        }

        d3.rebind(primary, dispatch, 'on');

        return primary;
    };
})(d3, fc, sc);
