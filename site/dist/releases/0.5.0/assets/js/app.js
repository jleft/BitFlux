(function() {
    'use strict';

    // Crazyness to get a strict mode compliant reference to the global object
    var global = null;
    /* jshint ignore:start */
    global = (1, eval)('this');
    /* jshint ignore:end */

    global.sc = {
        behavior: {},
        chart: {},
        data: {
            feed: {
                coinbase: {}
            }
        },
        menu: {
            generator: {},
            primary: {},
            secondary: {}
        },
        series: {},
        util: {
            dimensions: {},
            domain: {},
            zoom: {}
        }
    };
})();
(function(d3, fc, sc) {
    'use strict';

    sc.chart.foreground = function() {
        var topMargin = 0,
            rightMargin = 0,
            bottomMargin = 0,
            leftMargin = 0;

        var createForeground = fc.util.dataJoin()
            .selector('rect.foreground')
            .element('rect')
            .attr('class', 'foreground');

        function foreground(selection) {
            createForeground(selection, [selection.datum()])
                .layout({
                    position: 'absolute',
                    top: topMargin,
                    right: rightMargin,
                    bottom: bottomMargin,
                    left: leftMargin
                });

            selection.layout();
        }

        foreground.topMargin = function(x) {
            if (!arguments.length) {
                return topMargin;
            }
            topMargin = x;
            return foreground;
        };

        foreground.rightMargin = function(x) {
            if (!arguments.length) {
                return rightMargin;
            }
            rightMargin = x;
            return foreground;
        };

        foreground.bottomMargin = function(x) {
            if (!arguments.length) {
                return bottomMargin;
            }
            bottomMargin = x;
            return foreground;
        };

        foreground.leftMargin = function(x) {
            if (!arguments.length) {
                return leftMargin;
            }
            leftMargin = x;
            return foreground;
        };

        return foreground;
    };
})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.chart.macd = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch('viewChange');

        var macdTimeSeries = fc.chart.linearTimeSeries()
            .xAxisHeight(0)
            .yAxisWidth(yAxisWidth)
            .yOrient('right');

        var zero = fc.annotation.line()
            .value(0)
            .label('');
        var macdRenderer = fc.indicator.renderer.macd();
        var multi = fc.series.multi()
            .series([zero, macdRenderer])
            .mapping(function(series) {
                if (series === zero) {
                    return [0];
                }
                return this.data;
            })
            .decorate(function(g) {
                g.enter()
                    .attr('class', function(d, i) {
                        return ['multi zero', 'multi'][i];
                    });
            });

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

        var macdAlgorithm = fc.indicator.algorithm.macd();

        function macd(selection) {
            var dataModel = selection.datum();

            macdAlgorithm(dataModel.data);

            macdTimeSeries.xDomain(dataModel.viewDomain);

            // Add percentage padding either side of extreme high/lows
            var maxYExtent = d3.max(dataModel.data, function(d) {
                return Math.abs(d.macd.macd);
            });
            var paddedYExtent = sc.util.domain.padYDomain([-maxYExtent, maxYExtent], 0.04);
            macdTimeSeries.yDomain(paddedYExtent);

            // Redraw
            macdTimeSeries.plotArea(multi);
            selection.call(macdTimeSeries);

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');

            // Behaves oddly if not reinitialized every render
            var zoom = sc.behavior.zoom(macdTimeSeries.xScale())
                .on('zoom', function(domain) {
                    dispatch.viewChange(domain);
                });

            foreground.call(zoom);
        }

        d3.rebind(macd, dispatch, 'on');

        return macd;
    };
})(d3, fc, sc);
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

            // Behaves oddly if not reinitialized every render
            // Allow to zoom using mouse, but disable panning
            var zoom = sc.behavior.zoom(viewScale)
                .allowPan(false)
                .on('zoom', function(domain) {
                    dispatch.viewChange(domain);
                });

            selection.call(zoom);
        }

        d3.rebind(nav, dispatch, 'on');

        return nav;
    };

})(d3, fc, sc);
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

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

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

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');

            // Behaves oddly if not reinitialized every render
            var zoom = sc.behavior.zoom(timeSeries.xScale())
                .on('zoom', function(domain) {
                    dispatch.viewChange(domain);
                });

            foreground.call(zoom);
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
(function(d3, fc, sc) {
    'use strict';

    sc.chart.rsi = function() {
        var yAxisWidth = 45;

        var dispatch = d3.dispatch('viewChange');

        var rsiRenderer = fc.indicator.renderer.relativeStrengthIndex();
        var multi = fc.series.multi()
            .series([rsiRenderer])
            .mapping(function() { return this.data; });

        var createForeground = sc.chart.foreground()
            .rightMargin(yAxisWidth);

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

            selection.call(createForeground);
            var foreground = selection.select('rect.foreground');

            // Behaves oddly if not reinitialized every render
            var zoom = sc.behavior.zoom(rsiTimeSeries.xScale())
                .on('zoom', function(domain) {
                    dispatch.viewChange(domain);
                });

            foreground.call(zoom);
        }

        d3.rebind(rsi, dispatch, 'on');

        return rsi;
    };
})(d3, fc, sc);
(function(sc) {
    'use strict';

    sc.chart.xAxis = function() {

        var xAxisHeight = 20;
        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(6);

        function xAxisChart(selection) {
            var data = selection.datum().data;
            var viewDomain = selection.datum().viewDomain;

            // Redraw
            var xAxisContainer = selection.selectAll('g.x-axis')
                .data([data]);
            xAxisContainer.enter()
                .append('g')
                .attr('class', 'axis x-axis')
                .layout({
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    height: xAxisHeight
                });

            selection.layout();

            xScale.range([0, xAxisContainer.layout('width')])
                .domain(viewDomain);

            xAxisContainer.call(xAxis);
        }

        return xAxisChart;
    };
})(sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.buttonGroup = function(defaultValue) {
        if (!arguments.length) {
            defaultValue = 0;
        }

        var dispatch = d3.dispatch('optionChange');

        function layoutButtons(sel) {
            var activeValue = defaultValue < sel.datum().length ? defaultValue : 0;
            sel.selectAll('label')
                .data(sel.datum())
                .enter()
                .append('label')
                .classed('btn btn-default', true)
                .classed('active', function(d, i) { return (i === activeValue); })
                .text(function(d, i) { return d.displayString; })
                .insert('input')
                .attr({
                    type: 'radio',
                    name: 'options',
                    value: function(d, i) { return d.valueString; }
                })
                .property('checked', function(d, i) { return (i === activeValue); });
        }

        function optionGenerator(selection) {
            selection.call(layoutButtons);

            selection.selectAll('.btn')
                .on('click', function() {
                    var selectedOption = d3.select(this)
                        .datum();
                    dispatch.optionChange(selectedOption);
                });
        }

        d3.rebind(optionGenerator, dispatch, 'on');

        return optionGenerator;
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.toggleGroup = function() {
        var dispatch = d3.dispatch('toggleChange');

        function layoutButtons(sel) {
            sel.selectAll('label')
                .data(sel.datum())
                .enter()
                .append('label')
                .classed('btn btn-default', true)
                .text(function(d) { return d.displayString; })
                .append('input')
                .attr({
                    type: 'checkbox',
                    name: 'toggle',
                    value: function(d) { return d.valueString; }
                });
        }

        function toggleGenerator(selection) {
            selection.call(layoutButtons);

            selection.selectAll('.btn')
                .on('click', function() {
                    var self = d3.select(this);
                    setTimeout(function() {
                        var toggledOption = {
                            option: self.datum(),
                            toggled: self.select('input').property('checked')
                        };
                        dispatch.toggleChange(toggledOption);
                    }, 0);
                });
        }

        d3.rebind(toggleGenerator, dispatch, 'on');

        return toggleGenerator;
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.head = function() {

        var dispatch = d3.dispatch('resetToLive',
            'toggleSlideout',
            'dataTypeChange',
            'periodChange');

        function setPeriodChangeVisibility(visible) {
            var visibility = visible ? 'visible' : 'hidden';
            d3.select('#period-selection')
                .style('visibility', visibility);
        }

        setPeriodChangeVisibility(false);

        var dataTypeChangeOptions = function(selection) {
            selection.on('change', function() {
                if (this.value === 'bitcoin') {
                    setPeriodChangeVisibility(true);
                } else {
                    setPeriodChangeVisibility(false);
                }
                dispatch.dataTypeChange(this.value);
            });
        };

        var periodChangeOptions = function(selection) {
            selection.on('change', function() {
                dispatch.periodChange(this.value);
            });
        };

        var head = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#type-selection')
                    .call(dataTypeChangeOptions);
                selection.select('#period-selection')
                    .call(periodChangeOptions);
                selection.select('#reset-button')
                    .on('click', function() {
                        dispatch.resetToLive();
                    });
                selection.select('#toggle-button')
                    .on('click', function() {
                        dispatch.toggleSlideout();
                    });
            });
        };

        return d3.rebind(head, dispatch, 'on');
    };
})(d3, fc, sc);
(function(d3, fc) {
    'use strict';
    sc.menu.option = function(displayString, valueString, option) {
        return {
            displayString: displayString,
            valueString: valueString,
            option: option
        };
    };

})(d3, fc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.primary.indicators = function() {

        var dispatch = d3.dispatch('primaryChartIndicatorChange');

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        var movingAverageIndicator = sc.menu.option('Moving Average', 'movingAverage', movingAverage);
        var bollingerIndicator = sc.menu.option('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());

        var toggle = sc.menu.generator.toggleGroup()
            .on('toggleChange', function(indicator) {
                dispatch.primaryChartIndicatorChange(indicator);
            });

        var primaryChartIndicatorMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([movingAverageIndicator, bollingerIndicator]);
                selection.call(toggle);
            });
        };

        return d3.rebind(primaryChartIndicatorMenu, dispatch, 'on');
    };
})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.primary.series = function() {

        var dispatch = d3.dispatch('primaryChartSeriesChange');

        var candlestick = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        var ohlc = sc.menu.option('OHLC', 'ohlc', fc.series.ohlc());
        var line = sc.menu.option('Line', 'line', fc.series.line());
        line.option.isLine = true;
        var point = sc.menu.option('Point', 'point', fc.series.point());
        var area = sc.menu.option('Area', 'area', fc.series.area());

        var options = sc.menu.generator.buttonGroup()
            .on('optionChange', function(series) {
                dispatch.primaryChartSeriesChange(series);
            });

        var primaryChartSeriesMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([candlestick, ohlc, line, point, area]);
                selection.call(options);
            });
        };

        return d3.rebind(primaryChartSeriesMenu, dispatch, 'on');
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.primary.yValueAccessor = function() {

        var dispatch = d3.dispatch('primaryChartYValueAccessorChange');

        var open = sc.menu.option('Open', 'open', function(d) { return d.open; });
        var high = sc.menu.option('High', 'high', function(d) { return d.high; });
        var low = sc.menu.option('Low', 'low', function(d) { return d.low; });
        var close = sc.menu.option('Close', 'close', function(d) { return d.close; });

        var options = sc.menu.generator.buttonGroup(3)
            .on('optionChange', function(yValueAccessor) {
                dispatch.primaryChartYValueAccessorChange(yValueAccessor);
            });

        var primaryChartYValueAccessorMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([open, high, low, close]);
                selection.call(options);
            });
        };

        return d3.rebind(primaryChartYValueAccessorMenu, dispatch, 'on');
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.secondary.chart = function() {

        var dispatch = d3.dispatch('secondaryChartChange');

        var rsi = sc.menu.option('RSI', 'secondary-rsi', sc.chart.rsi());
        var macd = sc.menu.option('MACD', 'secondary-macd', sc.chart.macd());

        var toggle = sc.menu.generator.toggleGroup()
            .on('toggleChange', function(chart) {
                dispatch.secondaryChartChange(chart);
            });

        var secondaryChartMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([rsi, macd]);
                selection.call(toggle);
            });
        };

        return d3.rebind(secondaryChartMenu, dispatch, 'on');
    };
})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.menu.side = function() {

        var dispatch = d3.dispatch('primaryChartSeriesChange',
            'primaryChartYValueAccessorChange',
            'primaryChartIndicatorChange',
            'secondaryChartChange');

        var primaryChartSeriesOptions = sc.menu.primary.series()
            .on('primaryChartSeriesChange', function(series) {
                dispatch.primaryChartSeriesChange(series);
            });

        var primaryChartYValueAccessorOptions = sc.menu.primary.yValueAccessor()
            .on('primaryChartYValueAccessorChange', function(yValueAccessor) {
                dispatch.primaryChartYValueAccessorChange(yValueAccessor);
            });

        var primaryChartIndicatorOptions = sc.menu.primary.indicators()
            .on('primaryChartIndicatorChange', function(toggledIndicator) {
                dispatch.primaryChartIndicatorChange(toggledIndicator);
            });

        var secondaryChartOptions = sc.menu.secondary.chart()
            .on('secondaryChartChange', function(toggledChart) {
                dispatch.secondaryChartChange(toggledChart);
            });

        var side = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#series-buttons')
                    .call(primaryChartSeriesOptions);
                selection.select('#y-value-accessor-buttons')
                    .call(primaryChartYValueAccessorOptions);
                selection.select('#indicator-buttons')
                    .call(primaryChartIndicatorOptions);
                selection.select('#secondary-chart-buttons')
                    .call(secondaryChartOptions);
            });
        };

        return d3.rebind(side, dispatch, 'on');
    };
})(d3, fc, sc);
(function(sc) {
    'use strict';

    sc.util.callbackInvalidator = function() {
        var n = 0;

        function callbackInvalidator(callback) {
            var id = ++n;
            return function(err, data) {
                if (id < n) { return; }
                callback(err, data);
            };
        }

        callbackInvalidator.invalidateCallback = function() {
            n++;
            return callbackInvalidator;
        };

        return callbackInvalidator;
    };

})(sc);
(function(d3, fc) {
    'use strict';

    sc.util.dimensions.layout = function(container, secondaryCharts) {
        var headRowHeight = parseInt(container.select('.head-row').style('height'), 10) +
            parseInt(container.select('.head-row').style('padding-top'), 10) +
            parseInt(container.select('.head-row').style('padding-bottom'), 10);
        var navHeight = parseInt(container.select('.nav-row').style('height'), 10);
        var xAxisHeight = parseInt(container.select('.x-axis-row').style('height'), 10);

        var useableScreenHeight = window.innerHeight - headRowHeight - xAxisHeight - navHeight;

        var secondaryChartsShown = 0;
        for (var j = 0; j < secondaryCharts.length; j++) {
            if (secondaryCharts[j]) {
                secondaryChartsShown++;
            }
        }

        var primaryHeightRatio = 1 + secondaryChartsShown;
        var secondaryHeightRatio = secondaryChartsShown ? 1 : 0;
        var totalHeightRatio = 1 + 2 * secondaryChartsShown;

        container.select('.primary-row')
            .style('height', primaryHeightRatio * useableScreenHeight / totalHeightRatio + 'px');
        container.selectAll('.secondary-row')
            .filter(function(d, i) { return i < secondaryChartsShown; })
            .style('height', secondaryHeightRatio * useableScreenHeight / totalHeightRatio + 'px');
        container.selectAll('.secondary-row')
            .filter(function(d, i) { return i >= secondaryChartsShown; })
            .style('height', '0px');
    };

})(d3, fc);
(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.filterDataInDateRange = function(domain, data) {
        // Calculate visible data, given [startDate, endDate]
        var bisector = d3.bisector(function(d) { return d.date; });
        var filteredData = data.slice(
            // Pad and clamp the bisector values to ensure extents can be calculated
            Math.max(0, bisector.left(data, domain[0]) - 1),
            Math.min(bisector.right(data, domain[1]) + 1, data.length)
        );
        return filteredData;
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.moveToLatest = function(domain, data, ratio) {
        if (arguments.length < 3) {
            ratio = 1;
        }
        var dataExtent = fc.util.extent(data, 'date');
        var dataTimeExtent = (dataExtent[1].getTime() - dataExtent[0].getTime()) / 1000;
        var domainTimeExtent = ratio * (domain[1].getTime() - domain[0].getTime()) / 1000;
        var latest = data[data.length - 1].date;
        var scaledLiveDataDomain = domainTimeExtent < dataTimeExtent ?
            [d3.time.second.offset(latest, -domainTimeExtent), latest] : dataExtent;
        return scaledLiveDataDomain;
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';
    sc.util.domain.padYDomain = function(domain, paddingPercentage) {
        var paddedDomain = [];
        var variance = domain[1] - domain[0];
        paddedDomain[0] = domain[0] - variance * paddingPercentage;
        paddedDomain[1] = domain[1] + variance * paddingPercentage;
        return paddedDomain;
    };

})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.trackingLiveData = function(domain, data) {
        var latestViewedTime = domain[1].getTime();
        var lastDatumTime = data[data.length - 1].date.getTime();
        return latestViewedTime === lastDatumTime;
    };
})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.data.dataInterface = function() {
        var historicFeed = fc.data.feed.coinbase();
        var callbackGenerator = sc.util.callbackInvalidator();
        var ohlcConverter = sc.data.feed.coinbase.ohlcWebSocketAdaptor();
        var dataGenerator = fc.data.random.financial();
        var dispatch = d3.dispatch('messageReceived', 'dataLoaded');
        var candlesOfData = 200;

        function updateHistoricFeedDateRangeToPresent(period) {
            var currDate = new Date();
            var startDate = d3.time.second.offset(currDate, -candlesOfData * period);
            historicFeed.start(startDate)
                .end(currDate);
        }

        function newBasketReceived(basket, data) {
            if (data[data.length - 1].date.getTime() !== basket.date.getTime()) {
                data.push(basket);
            } else {
                data[data.length - 1] = basket;
            }
        }

        function liveCallback(data) {
            return function(socketEvent, latestBasket) {
                if (socketEvent.type === 'message' && latestBasket) {
                    newBasketReceived(latestBasket, data);
                }
                dispatch.messageReceived(socketEvent, data);
            };
        }

        function dataInterface(period) {
            dataInterface.invalidate();
            historicFeed.granularity(period);
            ohlcConverter.period(period);
            updateHistoricFeedDateRangeToPresent(period);
            var currentData = [];
            historicFeed(callbackGenerator(function(err, data) {
                if (!err) {
                    currentData = data.reverse();
                    ohlcConverter(liveCallback(currentData), currentData[currentData.length - 1]);
                }
                dispatch.dataLoaded(err, currentData);
            }));
        }

        dataInterface.generateData = function() {
            dataInterface.invalidate();
            dispatch.dataLoaded(null, dataGenerator(candlesOfData));
            return dataInterface;
        };

        dataInterface.invalidate = function() {
            ohlcConverter.close();
            callbackGenerator.invalidateCallback();
            return dataInterface;
        };

        d3.rebind(dataInterface, dispatch, 'on');

        return dataInterface;
    };

})(d3, fc, sc);
(function(sc) {
    'use strict';
    sc.data.feed.coinbase.ohlcWebSocketAdaptor = function() {
        // Expects transactions with a price, volume and date and organizes them into candles of given periods
        // Re-call OHLC whenever you want to start collecting for a new period/product
        // In seconds
        var period = 60 * 60 * 24;
        var liveFeed = sc.data.feed.coinbase.webSocket();

        function createNewBasket(datum, time) {
            return {
                date: time,
                open: datum.price,
                close: datum.price,
                low: datum.price,
                high: datum.price,
                volume: datum.volume
            };
        }

        function updateBasket(basket, datum) {
            if (basket == null) {
                basket = createNewBasket(datum, datum.date);
            }
            var latestTime = datum.date.getTime();
            var startTime = basket.date.getTime();
            var msPeriod = period * 1000;
            if (latestTime > startTime + msPeriod) {
                var timeIntoCurrentPeriod = (latestTime - startTime) % msPeriod;
                var newTime = latestTime - timeIntoCurrentPeriod;
                basket = createNewBasket(datum, new Date(newTime));
            } else {
                // Update current basket
                basket.high = Math.max(basket.high, datum.price);
                basket.low = Math.min(basket.low, datum.price);
                basket.volume += datum.volume;
                basket.close = datum.price;
            }
            return basket;
        }

        function ohlcWebSocketAdaptor(cb, initialBasket) {
            var basket = initialBasket;
            liveFeed(function(err, datum) {
                if (datum) {
                    basket = updateBasket(basket, datum);
                }
                cb(err, basket);
            });
        }

        ohlcWebSocketAdaptor.period = function(x) {
            if (!arguments.length) {
                return period;
            }
            period = x;
            return ohlcWebSocketAdaptor;
        };

        d3.rebind(ohlcWebSocketAdaptor, liveFeed, 'product', 'messageType', 'close');

        return ohlcWebSocketAdaptor;
    };
})(sc);

(function(sc) {
    'use strict';
    sc.data.feed.coinbase.webSocket = function() {
        var product = 'BTC-USD';
        var msgType = 'match';
        var coinbaseSocket = null;

        function webSocket(cb) {
            webSocket.close();
            coinbaseSocket = new WebSocket('wss://ws-feed.exchange.coinbase.com');
            var msg = {
                type: 'subscribe',
                'product_id': product
            };

            coinbaseSocket.onopen = function(event) {
                coinbaseSocket.send(JSON.stringify(msg));
                cb(event, null);
            };

            coinbaseSocket.onmessage = function(event) {
                var messageData = JSON.parse(event.data);
                if (messageData.type === msgType) {
                    var datum = {};
                    datum.date = new Date(messageData.time);
                    datum.price = parseFloat(messageData.price);
                    datum.volume = parseFloat(messageData.size);
                    cb(event, datum);
                }
            };

            coinbaseSocket.onerror = function(event) {
                cb(event, null);
            };

            coinbaseSocket.onclose = function(event) {
                cb(event, null);
            };

        }

        webSocket.close = function() {
            if (coinbaseSocket) {
                coinbaseSocket.close();
            }
            return webSocket;
        };

        webSocket.messageType = function(x) {
            if (!arguments.length) {
                return msgType;
            }
            msgType = x;
            return webSocket;
        };

        webSocket.product = function(x) {
            if (!arguments.length) {
                return product;
            }
            product = x;
            return webSocket;
        };

        return webSocket;
    };

})(sc);

(function(d3, fc, sc) {
    'use strict';

    sc.behavior.zoom = function(scale) {

        var dispatch = d3.dispatch('zoom');

        var zoomBehavior = d3.behavior.zoom();
        var zoomScale = scale;

        var allowPan = true;
        var allowZoom = true;

        function controlPan(zoom, selection, scale) {
            var tx = zoom.translate()[0];

            var width = selection.attr('width') || parseInt(selection.style('width'), 10);
            var xExtent = fc.util.extent(selection.datum().data, ['date']);
            var min = scale(xExtent[0]);
            var max = scale(xExtent[1]);

            // Don't pan off sides
            if (min > 0) {
                tx -= min;
            } else if (max - width < 0) {
                tx -= (max - width);
            }

            zoom.translate([tx, 0]);
        }

        function controlZoom(zoom, selection, scale) {
            var tx = zoom.translate()[0];

            var width = selection.attr('width') || parseInt(selection.style('width'), 10);
            var xExtent = fc.util.extent(selection.datum().data, ['date']);
            var min = scale(xExtent[0]);
            var max = scale(xExtent[1]);

            // If zooming, and about to pan off screen, do nothing
            if (zoom.scale() !== 1) {
                if ((min >= 0) && (max - width) <= 0) {
                    scale.domain(xExtent);
                    zoom.x(scale);
                    tx = scale(xExtent[0]);
                    zoom.translate([tx, 0]);
                    return true;
                }
            }
            return false;
        }

        function zoom(selection) {
            zoomBehavior.x(zoomScale)
                .on('zoom', function() {
                    var maxDomainViewed = controlZoom(zoomBehavior, selection, zoomScale);
                    controlPan(zoomBehavior, selection, zoomScale);

                    var domain = zoomScale.domain();
                    if (selection.datum().trackingLive && (zoomBehavior.scale() > 1)) {
                        domain = sc.util.domain.moveToLatest(zoomScale.domain(), selection.datum().data);
                    }

                    var panned = (zoomBehavior.scale() === 1)  && !maxDomainViewed;
                    var zoomed = (zoomBehavior.scale() !== 1) || maxDomainViewed;
                    if ((panned && allowPan) || (zoomed && allowZoom)) {
                        dispatch.zoom(domain);
                    }
                });

            selection.call(zoomBehavior);
        }

        zoom.allowPan = function(x) {
            if (!arguments.length) {
                return allowPan;
            }
            allowPan = x;
            return zoom;
        };
        zoom.allowZoom = function(x) {
            if (!arguments.length) {
                return allowZoom;
            }
            allowZoom = x;
            return zoom;
        };

        d3.rebind(zoom, dispatch, 'on');

        return zoom;
    };
})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';
    /* Credit to Chris Price for this optimisation
    http://blog.scottlogic.com/2015/08/06/an-adventure-in-svg-filter-land.html
    */
    sc.series.candlestick = function() {
        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var barWidth = fc.util.fractionalBarWidth(0.75);
        var xValue = function(d, i) { return d.date; };
        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };
        var yLowValue = function(d) { return d.low; };
        var yHighValue = function(d) { return d.high; };

        var candlestickSvg = fc.svg.candlestick()
            .x(function(d) { return xScale(d.date); })
            .open(function(d) { return yScale(d.open); })
            .high(function(d) { return yScale(yHighValue(d)); })
            .low(function(d) { return yScale(yLowValue(d)); })
            .close(function(d) { return yScale(d.close); });

        var upDataJoin = fc.util.dataJoin()
            .selector('path.up')
            .element('path')
            .attr('class', 'up');

        var downDataJoin = fc.util.dataJoin()
            .selector('path.down')
            .element('path')
            .attr('class', 'down');

        var candlestick = function(selection) {
            selection.each(function(data) {
                candlestickSvg.width(barWidth(data.map(xValueScaled)));

                var upData = data.filter(function(d) { return d.open < d.close; });
                var downData = data.filter(function(d) { return d.open >= d.close; });

                upDataJoin(this, [upData])
                    .attr('d', candlestickSvg);

                downDataJoin(this, [downData])
                    .attr('d', candlestickSvg);
            });
        };

        candlestick.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return candlestick;
        };

        candlestick.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return candlestick;
        };

        candlestick.yLowValue = function(x) {
            if (!arguments.length) {
                return yLowValue;
            }
            yLowValue = x;
            return candlestick;
        };

        candlestick.yHighValue = function(x) {
            if (!arguments.length) {
                return yHighValue;
            }
            yHighValue = x;
            return candlestick;
        };

        return candlestick;
    };
})(d3, fc, sc);
(function(d3, fc, sc) {
    'use strict';

    sc.app = function() {

        var app = {};

        var container = d3.select('#app-container');
        var svgPrimary = container.select('svg.primary');
        var svgSecondary = container.selectAll('svg.secondary');
        var svgXAxis = container.select('svg.x-axis');
        var svgNav = container.select('svg.nav');

        var dataModel = {
            data: [],
            period: 60 * 60 * 24,
            trackingLive: true,
            viewDomain: []
        };

        var primaryChart = sc.chart.primary();
        var secondaryCharts = [];
        var xAxis = sc.chart.xAxis();
        var nav = sc.chart.nav();

        function render() {
            svgPrimary.datum(dataModel)
                .call(primaryChart);

            svgSecondary.datum(dataModel)
                .filter(function(d, i) { return i < secondaryCharts.length; })
                .each(function(d, i) {
                    d3.select(this)
                        .attr('class', 'chart secondary ' + secondaryCharts[i].valueString)
                        .call(secondaryCharts[i].option);
                });

            svgXAxis.datum(dataModel)
                .call(xAxis);

            svgNav.datum(dataModel)
                .call(nav);
        }

        function updateLayout() {
            sc.util.dimensions.layout(container, secondaryCharts);
        }

        function initialiseResize() {
            d3.select(window).on('resize', function() {
                updateLayout();
                render();
            });
        }

        function onViewChanged(domain) {
            dataModel.viewDomain = [domain[0], domain[1]];
            dataModel.trackingLive = sc.util.domain.trackingLiveData(dataModel.viewDomain, dataModel.data);
            render();
        }

        function initialiseChartEventHandlers() {
            primaryChart.on('viewChange', onViewChanged);
            nav.on('viewChange', onViewChanged);
        }

        function resetToLive() {
            var data = dataModel.data;
            var dataDomain = fc.util.extent(data, 'date');
            var navTimeDomain = sc.util.domain.moveToLatest(dataDomain, data, 0.2);
            onViewChanged(navTimeDomain);
        }

        function initialiseDataInterface() {
            var dataInterface = sc.data.dataInterface()
                .on('messageReceived', function(socketEvent, data) {
                    if (socketEvent.type === 'error' ||
                        (socketEvent.type === 'close' && socketEvent.code !== 1000)) {
                        console.log('Error loading data from coinbase websocket: ' +
                        socketEvent.type + ' ' + socketEvent.code);
                    } else if (socketEvent.type === 'message') {
                        dataModel.data = data;
                        if (dataModel.trackingLive) {
                            var newDomain = sc.util.domain.moveToLatest(dataModel.viewDomain, dataModel.data);
                            onViewChanged(newDomain);
                        }
                    }
                })
                .on('dataLoaded', function(err, data) {
                    if (err) {
                        console.log('Error getting historic data: ' + err);
                    } else {
                        dataModel.data = data;
                        resetToLive();
                    }
                });
            return dataInterface;
        }

        function initialiseHeadMenu(dataInterface) {
            var headMenu = sc.menu.head()
                .on('dataTypeChange', function(type) {
                    if (type === 'bitcoin') {
                        dataModel.period = container.select('#period-selection').property('value');
                        dataInterface(dataModel.period);
                    } else if (type === 'generated') {
                        dataInterface.generateData();
                        dataModel.period = 60 * 60 * 24;
                    }
                })
                .on('periodChange', function(period) {
                    dataModel.period = period;
                    dataInterface(dataModel.period);
                })
                .on('resetToLive', resetToLive)
                .on('toggleSlideout', function() {
                    container.selectAll('.row-offcanvas-right').classed('active',
                        !container.selectAll('.row-offcanvas-right').classed('active'));
                });

            container.select('.head-menu')
                .call(headMenu);
        }

        function initialiseSideMenu() {
            var sideMenu = sc.menu.side()
                .on('primaryChartSeriesChange', function(series) {
                    primaryChart.changeSeries(series);
                    render();
                })
                .on('primaryChartYValueAccessorChange', function(yValueAccessor) {
                    primaryChart.changeYValueAccessor(yValueAccessor);
                    render();
                })
                .on('primaryChartIndicatorChange', function(toggledIndicator) {
                    primaryChart.toggleIndicator(toggledIndicator);
                    render();
                })
                .on('secondaryChartChange', function(toggledChart) {
                    if (secondaryCharts.indexOf(toggledChart.option) !== -1 && !toggledChart.toggled) {
                        secondaryCharts.splice(secondaryCharts.indexOf(toggledChart.option), 1);
                    } else if (toggledChart.toggled) {
                        toggledChart.option.option.on('viewChange', onViewChanged);
                        secondaryCharts.push(toggledChart.option);
                    }
                    svgSecondary.selectAll('*').remove();
                    updateLayout();
                    render();
                });

            container.select('.sidebar-menu')
                .call(sideMenu);
        }

        app.run = function() {
            initialiseChartEventHandlers();

            var dataInterface = initialiseDataInterface();
            initialiseHeadMenu(dataInterface);
            initialiseSideMenu();

            initialiseResize();

            updateLayout();

            dataInterface.generateData();
        };

        return app;
    };
})(d3, fc, sc);

(function(d3, fc, sc) {
    'use strict';

    sc.app().run();

})(d3, fc, sc);
