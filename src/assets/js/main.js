(function(d3, fc) {
    'use strict';
    function getVisibleData(data, dateExtent) {
        // Calculate visible data, given [startDate, endDate]
        var bisector = d3.bisector(function(d) { return d.date; });
        var visibleData = data.slice(
        // Pad and clamp the bisector values to ensure extents can be calculated
            Math.max(0, bisector.left(data, dateExtent[0]) - 1),
            Math.min(bisector.right(data, dateExtent[1]) + 1, data.length)
        );
        return visibleData;
    }

    // Set SVGs & column padding
    var container = d3.select('#chart-example');

    var svgMain = container.select('svg.main');
    var svgRSI = container.select('svg.rsi');
    var svgNav = container.select('svg.nav');

    function calculateDimensions() {
        var leftPadding = parseInt(container.select('.col-md-12').style('padding-left'), 10);
        var rightPadding = parseInt(container.select('.col-md-12').style('padding-right'), 10);

        var resetRowHeight = parseInt(container.select('#head-row').style('height'), 10);

        var useableScreenWidth = parseInt(container.style('width'), 10) - (leftPadding + rightPadding);
        var useableScreenHeight = window.innerHeight - resetRowHeight - 2 * fc.chart.linearTimeSeries().xAxisHeight();

        var targetWidth;
        var targetHeight;

        var maxWidthToHeightRatio = 1.5;
        var maxHeightToWidthRatio = 1.5;

        if (useableScreenWidth > maxWidthToHeightRatio * useableScreenHeight) {
            targetWidth = maxWidthToHeightRatio * useableScreenHeight;
            targetHeight = useableScreenHeight;
        } else if (useableScreenHeight > maxHeightToWidthRatio * useableScreenWidth) {
            targetWidth = useableScreenWidth;
            targetHeight = maxHeightToWidthRatio * useableScreenWidth;
        } else {
            targetWidth = useableScreenWidth;
            targetHeight = useableScreenHeight;
        }

        var mainHeightRatio = 0.6;
        var rsiHeightRatio = 0.3;
        var navHeightRatio = 0.2;
        var totalHeightRatio = mainHeightRatio + rsiHeightRatio + navHeightRatio;

        svgMain.attr('width', targetWidth)
            .attr('height', mainHeightRatio * targetHeight / totalHeightRatio);
        svgRSI.attr('width', targetWidth)
            .attr('height', rsiHeightRatio * targetHeight / totalHeightRatio);
        svgNav.attr('width', targetWidth)
            .attr('height', navHeightRatio * targetHeight / totalHeightRatio);

        var navAspect = (navHeightRatio * targetHeight) / (totalHeightRatio * targetWidth);

        standardDateDisplay = [data[Math.floor((1 - navAspect * goldenRatio) * data.length)].date,
            data[data.length - 1].date];
    }

    var candlestick = fc.series.candlestick();
    var ohlc = fc.series.ohlc();
    var point = fc.series.point();
    var line = fc.series.line();
    var area = fc.series.area();

    var currentSeries = candlestick;

    var data = fc.data.random.financial()(250);

    // Using golden ratio to make initial display area rectangle into the golden rectangle
    var goldenRatio = 1.618;

    var standardDateDisplay;

    calculateDimensions();

    function changeSeries(seriesTypeString) {
        switch (seriesTypeString) {
            case 'ohlc':
                currentSeries = ohlc;
                break;
            case 'candlestick':
                currentSeries = candlestick;
                break;
            case 'line':
                currentSeries = line;
                break;
            case 'point':
                currentSeries = point;
                break;
            case 'area':
                currentSeries = area;
                break;
            default:
                currentSeries = candlestick;
                break;
        }
        multi.series([gridlines, ma, currentSeries, closeAxisAnnotation]);
        render();
    }

    d3.select('#series-buttons')
        .selectAll('.btn')
        .on('click', function() {
            var seriesTypeString = d3.select(this)
                .select('input')
                .node()
                .value;
            changeSeries(seriesTypeString);
        });

    // Set Reset button event
    function resetToLive() {
        timeSeries.xDomain(standardDateDisplay);
        render();
    }

    container.select('#reset-button').on('click', resetToLive);

    // Create main chart and set how much data is initially viewed
    var timeSeries = fc.chart.linearTimeSeries()
        .xDomain(standardDateDisplay)
        .xTicks(6);

    var gridlines = fc.annotation.gridline()
        .yTicks(5)
        .xTicks(0);

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

    var priceFormat = d3.format('.2f');

    var closeAxisAnnotation = fc.annotation.line()
        .orient('horizontal')
        .value(function(d) { return d.close; })
        .label(function(d) { return priceFormat(d.close); })
        .decorate(function(sel) {
            positionCloseAxis(sel);
            sel.enter().classed('close', true);
        });

    // Create and apply the Moving Average
    var movingAverage = fc.indicator.algorithm.movingAverage();

    // Create a line that renders the result
    var ma = fc.series.line()
        .decorate(function(selection) {
            selection.enter()
                .classed('ma', true);
        })
        .yValue(function(d) { return d.movingAverage; });

    function render() {
        svgMain.datum(data)
            .call(mainChart);

        svgRSI.datum(data)
            .call(rsiChart);

        svgNav.datum(data)
            .call(navChart);
    }

    var multi = fc.series.multi()
        .series([gridlines, ma, currentSeries, closeAxisAnnotation])
        .mapping(function(series) {
            switch (series) {
                case closeAxisAnnotation:
                    return [data[data.length - 1]];
                default:
                    return data;
            }
        })
        .key(function(series, index) {
            switch (series) {
                case line:
                    return index;
                default:
                    return series;
            }
        });

    function zoomCall(zoom, data, scale) {
        return function() {
            var tx = zoom.translate()[0];
            var ty = zoom.translate()[1];

            var xExtent = fc.util.extent(data, ['date']);
            var min = scale(xExtent[0]);
            var max = scale(xExtent[1]);

            // Don't pan off sides
            var width = svgMain.attr('width');
            if (min > 0) {
                tx -= min;
            } else if (max - width < 0) {
                tx -= (max - width);
            }
            // If zooming, and about to pan off screen, do nothing
            if (zoom.scale() !== 1) {
                if ((min >= 0) && (max - width) <= 0) {
                    scale.domain(xExtent);
                    zoom.x(scale);
                    tx = scale(xExtent[0]);
                }
            }

            zoom.translate([tx, ty]);
            render();
        };
    }

    var mainChart = function(selection) {
        data = selection.datum();
        movingAverage(data);

        // Scale y axis
        var yExtent = fc.util.extent(getVisibleData(data, timeSeries.xDomain()), ['low', 'high']);
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
            .on('zoom', zoomCall(zoom, data, timeSeries.xScale()));

        selection.call(zoom);
    };

    // Create RSI chart
    var rsiScale = d3.scale.linear()
        .domain([0, 100]);

    var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();

    var rsi = fc.indicator.renderer.relativeStrengthIndex()
        .yScale(rsiScale);

    var rsiChart = function(selection) {
        data = selection.datum();
        rsi.xScale(timeSeries.xScale());
        rsi.yScale().range([parseInt(svgRSI.style('height'), 10), 0]);
        rsiAlgorithm(data);
        // Important for initialization that this happens after timeSeries is called [or can call render() twice]
        var zoom = d3.behavior.zoom();
        zoom.x(timeSeries.xScale())
            .on('zoom', zoomCall(zoom, data, timeSeries.xScale()));
        selection.call(zoom);
        selection.call(rsi);
    };

    // Create navigation chart
    var yExtent = fc.util.extent(getVisibleData(data, fc.util.extent(data, 'date')), ['low', 'high']);
    var navTimeSeries = fc.chart.linearTimeSeries()
        .xDomain(fc.util.extent(data, 'date'))
        .yDomain(yExtent)
        .yTicks(0);

    area.yValue(function(d) { return d.open; })
        .y0Value(yExtent[0]);

    line.yValue(function(d) { return d.open; });

    var brush = d3.svg.brush();
    var navMulti = fc.series.multi().series([area, line, brush]);

    var navChart = function(selection) {
        data = selection.datum();

        brush.on('brush', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] !== 0) {
                    // Control the main chart's time series domain
                    timeSeries.xDomain([brush.extent()[0][0], brush.extent()[1][0]]);
                    render();
                }
            });

        // Allow to zoom using mouse, but disable panning
        var zoom = d3.behavior.zoom();
        zoom.x(timeSeries.xScale())
            .on('zoom', function() {
                if (zoom.scale() === 1) {
                    zoom.translate([0, 0]);
                } else {
                    // Usual behavior
                    zoomCall(zoom, data, timeSeries.xScale())();
                }
            });
        selection.call(zoom);

        navMulti.mapping(function(series) {
                if (series === brush) {
                    brush.extent([
                        [timeSeries.xDomain()[0], navTimeSeries.yDomain()[0]],
                        [timeSeries.xDomain()[1], navTimeSeries.yDomain()[1]]
                    ]);
                }
                return data;
            });

        navTimeSeries.plotArea(navMulti);
        selection.call(navTimeSeries);
    };

    function resize() {
        calculateDimensions();
        render();
    }

    d3.select(window).on('resize', resize);

    resize();


})(d3, fc);
