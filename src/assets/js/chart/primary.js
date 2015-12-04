import d3 from 'd3';
import fc from 'd3fc';
import util from '../util/util';
import event from '../event';
import option from '../model/menu/option';
import candlestick from '../series/candlestick';
import zoomBehavior from '../behavior/zoom';

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
    var extent = fc.util.extent()
      .fields(extentAccessor)(visibleData);

    if (currentIndicators.length) {
        var indicators = currentIndicators.map(function(indicator) { return indicator.valueString; });
        var movingAverageShown = (indicators.indexOf('movingAverage') !== -1);
        var bollingerBandsShown = (indicators.indexOf('bollinger') !== -1);
        if (bollingerBandsShown) {
            var bollingerBandsVisibleDataObject = visibleData.map(function(d) { return d.bollingerBands; });
            var bollingerBandsExtent = fc.util.extent()
              .fields(['lower', 'upper'])(bollingerBandsVisibleDataObject);
            extent[0] = d3.min([bollingerBandsExtent[0], extent[0]]);
            extent[1] = d3.max([bollingerBandsExtent[1], extent[1]]);
        }
        if (movingAverageShown) {
            var movingAverageExtent = fc.util.extent()
              .fields('movingAverage')(visibleData);
            extent[0] = d3.min([movingAverageExtent[0], extent[0]]);
            extent[1] = d3.max([movingAverageExtent[1], extent[1]]);
        }
        if (!(movingAverageShown || bollingerBandsShown)) {
            throw new Error('Unexpected indicator type');
        }
    }
    return extent;
}

export default function() {

    var yAxisWidth = 60;
    var dispatch = d3.dispatch(event.viewChange, event.crosshairChange);

    var currentSeries;
    var currentYValueAccessor = function(d) { return d.close; };
    var currentIndicators = [];
    var zoomWidth;

    var crosshairData = [];
    var crosshair = fc.tool.crosshair()
      .xLabel('')
      .yLabel('')
      .on('trackingmove', function(updatedCrosshairData) {
          if (updatedCrosshairData.length > 0) {
              dispatch.crosshairChange(updatedCrosshairData[0].datum);
          } else {
              dispatch.crosshairChange(undefined);
          }
      })
      .on('trackingend', function() {
          dispatch.crosshairChange(undefined);
      });
    crosshair.id = util.uid();

    var gridlines = fc.annotation.gridline()
      .yTicks(5)
      .xTicks(0);
    var closeLine = fc.annotation.line()
      .orient('horizontal')
      .value(currentYValueAccessor)
      .label('');
    closeLine.id = util.uid();

    var multi = fc.series.multi()
        .key(function(series) { return series.id; })
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

    var primaryChart = fc.chart.cartesian(xScale, yScale)
      .xTicks(0)
      .yOrient('right')
      .margin({
          top: 0,
          left: 0,
          bottom: 0,
          right: yAxisWidth
      });

    // Create and apply the Moving Average
    var movingAverage = fc.indicator.algorithm.movingAverage();
    var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

    function updateMultiSeries() {
        var baseChart = [gridlines, currentSeries.option, closeLine];
        var indicators = currentIndicators.map(function(indicator) { return indicator.option; });
        return baseChart.concat(indicators, crosshair);
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

    // Call when what to display on the chart is modified (ie series, options)
    function selectorsChanged(model) {
        currentSeries = model.series;
        currentYValueAccessor = model.yValueAccessor.option;
        currentIndicators = model.indicators;
        updateYValueAccessorUsed();
        multi.series(updateMultiSeries());
        primaryChart.yTickFormat(model.product.priceFormat);
        model.selectorsChanged = false;
    }

    function bandCrosshair(data) {
        var width = currentSeries.option.width(data);

        crosshair.decorate(function(selection) {
            selection.classed('band', true);

            selection.selectAll('.vertical > line')
              .style('stroke-width', width);
        });
    }

    function lineCrosshair(selection) {
        selection.classed('band', false)
            .selectAll('line')
            .style('stroke-width', null);
    }
    function updateCrosshairDecorate(data) {
        if (currentSeries.valueString === 'candlestick' || currentSeries.valueString === 'ohlc') {
            bandCrosshair(data);
        } else {
            crosshair.decorate(lineCrosshair);
        }
    }

    function primary(selection) {
        var model = selection.datum();

        if (model.selectorsChanged) {
            selectorsChanged(model);
        }

        primaryChart.xDomain(model.viewDomain);

        crosshair.snap(fc.util.seriesPointSnapXOnly(currentSeries.option, model.data));
        updateCrosshairDecorate(model.data);

        movingAverage(model.data);
        bollingerAlgorithm(model.data);

        // Scale y axis
        var visibleData = util.domain.filterDataInDateRange(primaryChart.xDomain(), model.data);
        var yExtent = findTotalYExtent(visibleData, currentSeries, currentIndicators);
        // Add percentage padding either side of extreme high/lows
        var paddedYExtent = util.domain.padYDomain(yExtent, 0.04);
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

        var zoom = zoomBehavior(zoomWidth)
          .scale(xScale)
          .trackingLatest(model.trackingLatest)
          .on('zoom', function(domain) {
              dispatch[event.viewChange](domain);
          });

        selection.select('.plot-area')
          .call(zoom);
    }

    d3.rebind(primary, dispatch, 'on');

    // Call when the main layout is modified
    primary.dimensionChanged = function(container) {
        zoomWidth = parseInt(container.style('width'), 10) - yAxisWidth;
    };

    return primary;
}
