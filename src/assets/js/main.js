(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#chart-example');

    var svgMain = container.select('svg.main');
    var svgRSI = container.select('svg.rsi');
    var svgNav = container.select('svg.nav');

    var candlestick = fc.series.candlestick();
    var ohlc = fc.series.ohlc();
    var point = fc.series.point();
    var line = fc.series.line();
    var area = fc.series.area();

    var currentSeries = candlestick;

    var data = fc.data.random.financial()(250);

    // Using golden ratio to make initial display area rectangle into the golden rectangle
    var goldenRatio = 1.618;

    sc.util.calculateDimensions(container);

    var navAspect = parseInt(svgNav.style('height'), 10) / svgNav.attr('width');

    var standardDateDisplay = [data[Math.floor((1 - navAspect * goldenRatio) * data.length)].date,
        data[data.length - 1].date];

    var viewScale = fc.scale.dateTime().range([0, svgMain.attr('width')]);
    var primaryChart = sc.primaryChart()
        .shareViewScale(viewScale)
        .changeSeries('candlestick');

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
        primaryChart.changeSeries(currentSeries);
    }

    d3.select('#series-buttons')
        .selectAll('.btn')
        .on('click', function() {
            var seriesTypeString = d3.select(this)
                .select('input')
                .node()
                .value;
            changeSeries(seriesTypeString);
            render();
        });

    // Set Reset button event
    function resetToLive() {
        viewScale.domain(standardDateDisplay);
        render();
    }

    container.select('#reset-button').on('click', resetToLive);

    function render() {
        svgMain.datum(data)
            .call(primaryChart);

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

    sc.zoomCall = function(zoom, data, scale) {
        return function() {
            sc.util.zoomControl(zoom, selection, data, scale);
            render();
        };
    }

    var mainChart = function(selection) {
        data = selection.datum();
        movingAverage(data);

        // Scale y axis
        var yExtent = fc.util.extent(sc.util.filterDataInDateRange(data, timeSeries.xDomain()), ['low', 'high']);
        timeSeries.yDomain(yExtent);

        // Redraw
        timeSeries.plotArea(multi);
        selection.call(timeSeries);

        // Behaves oddly if not reinitialized every render
        var zoom = d3.behavior.zoom();
        zoom.x(timeSeries.xScale())
            .on('zoom', zoomCall(zoom, selection, data, timeSeries.xScale()));

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
        rsi.xScale(viewScale);
        rsi.yScale().range([parseInt(svgRSI.style('height'), 10), 0]);
        rsiAlgorithm(data);
        // Important for initialization that this happens after timeSeries is called [or can call render() twice]
        var zoom = d3.behavior.zoom();
        zoom.x(viewScale)
            .on('zoom', sc.zoomCall(zoom, selection, data, viewScale));

        selection.call(zoom);
        selection.call(rsi);
    };

    // Create navigation chart
    var yExtent = fc.util.extent(sc.util.filterDataInDateRange(data, fc.util.extent(data, 'date')), ['low', 'high']);
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
                    viewScale.domain([brush.extent()[0][0], brush.extent()[1][0]]);
                    render();
                }
            });

        // Allow to zoom using mouse, but disable panning
        var zoom = d3.behavior.zoom();
        zoom.x(viewScale)
            .on('zoom', function() {
                if (zoom.scale() === 1) {
                    zoom.translate([0, 0]);
                } else {
                    // Usual behavior
                    sc.zoomCall(zoom, selection, data, viewScale)();
                }
            });
        selection.call(zoom);

        navMulti.mapping(function(series) {
                if (series === brush) {
                    brush.extent([
                        [viewScale.domain()[0], navTimeSeries.yDomain()[0]],
                        [viewScale.domain()[1], navTimeSeries.yDomain()[1]]
                    ]);
                }
                return data;
            });

        navTimeSeries.plotArea(navMulti);
        selection.call(navTimeSeries);
    };

    function resize() {
        sc.util.calculateDimensions(container);

        var navAspect = parseInt(svgNav.style('height'), 10) / svgNav.attr('width');

        standardDateDisplay = [data[Math.floor((1 - navAspect * goldenRatio) * data.length)].date,
            data[data.length - 1].date];

        render();
    }

    d3.select(window).on('resize', resize);

    calculateDimensions();
    resetToLive();
    resize();

})(d3, fc, sc);
