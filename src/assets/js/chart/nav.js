import d3 from 'd3';
import fc from 'd3fc';
import util from '../util/util';
import event from '../event';
import zoomBehavior from '../behavior/zoom';

export default function() {
    var navHeight = 100; // Also maintain in variables.less
    var bottomMargin = 40; // Also maintain in variables.less
    var navChartHeight = navHeight - bottomMargin;
    var backgroundStrokeWidth = 2; // Also maintain in variables.less
    // Stroke is half inside half outside, so stroke/2 per border
    var borderWidth = backgroundStrokeWidth / 2;
    // should have been 2 * borderWidth, but for unknown reason it is incorrect in practice.
    var extentHeight = navChartHeight - borderWidth;
    var barHeight = extentHeight;
    var handleCircleCenter = borderWidth + barHeight / 2;
    var handleBarWidth = 2;

    var dispatch = d3.dispatch(event.viewChange);

    var navChart = fc.chart.cartesian(fc.scale.dateTime(), d3.scale.linear())
      .yTicks(0)
      .margin({
          bottom: bottomMargin      // Variable also in navigator.less - should be used once ported to flex
      });

    var viewScale = fc.scale.dateTime();

    var area = fc.series.area()
      .yValue(function(d) { return d.close; });
    var line = fc.series.line()
      .yValue(function(d) { return d.close; });
    var brush = d3.svg.brush();
    var navMulti = fc.series.multi()
      .series([area, line, brush])
      .decorate(function(selection) {
          var enter = selection.enter();

          selection.select('.extent')
            .attr('height', extentHeight)
            .attr('y', backgroundStrokeWidth / 2);

          // overload d3 styling for the brush handles
          // as Firefox does not react properly to setting these through less file.
          enter.selectAll('.resize.w>rect, .resize.e>rect')
            .attr('width', handleBarWidth)
            .attr('x', -handleBarWidth / 2);
          selection.selectAll('.resize.w>rect, .resize.e>rect')
            .attr('height', barHeight)
            .attr('y', borderWidth);

          // Adds the handles to the brush sides
          var handles = enter.selectAll('.e, .w');
          handles.append('circle')
            .attr('cy', handleCircleCenter)
            .attr('r', 7)
            .attr('class', 'outer-handle');
          handles.append('circle')
            .attr('cy', handleCircleCenter)
            .attr('r', 4)
            .attr('class', 'inner-handle');
      })
      .mapping(function(series) {
          if (series === brush) {
              brush.extent([
                  [viewScale.domain()[0], navChart.yDomain()[0]],
                  [viewScale.domain()[1], navChart.yDomain()[1]]
              ]);
          } else {
              // This stops the brush data being overwritten by the point data
              return this.data;
          }
      });
    var layoutWidth;


    function setHide(selection, brushHide) {
        selection.select('.plot-area')
          .selectAll('.e, .w')
          .classed('hidden', brushHide);
    }

    function xEmpty(navBrush) {
        return ((navBrush.extent()[0][0] - navBrush.extent()[1][0]) === 0);
    }

    function nav(selection) {
        var model = selection.datum();

        viewScale.domain(model.viewDomain);

        var filteredData = util.domain.filterDataInDateRange(
          fc.util.extent().fields('date')(model.data),
          model.data);
        var yExtent = fc.util.extent()
          .fields(['low', 'high'])(filteredData);

        var brushHide = false;

        navChart.xDomain(fc.util.extent().fields('date')(model.data))
          .yDomain(yExtent);

        brush.on('brush', function() {
            var brushExtentIsEmpty = xEmpty(brush);

            // Hide the bar if the extent is empty
            setHide(selection, brushExtentIsEmpty);
            if (!brushExtentIsEmpty) {
                dispatch[event.viewChange]([brush.extent()[0][0], brush.extent()[1][0]]);
            }
        })
            .on('brushend', function() {
                var brushExtentIsEmpty = xEmpty(brush);
                setHide(selection, false);
                if (brushExtentIsEmpty) {
                    dispatch[event.viewChange](util.domain.centerOnDate(viewScale.domain(),
                        model.data, brush.extent()[0][0]));
                }
            });

        navChart.plotArea(navMulti);
        selection.call(navChart);

        // Allow to zoom using mouse, but disable panning
        var zoom = zoomBehavior(layoutWidth)
          .scale(viewScale)
          .trackingLatest(model.trackingLatest)
          .allowPan(false)
          .on('zoom', function(domain) {
              dispatch[event.viewChange](domain);
          });

        selection.select('.plot-area')
          .call(zoom);
    }

    d3.rebind(nav, dispatch, 'on');

    nav.dimensionChanged = function(container) {
        layoutWidth = parseInt(container.style('width'), 10);
        viewScale.range([0, layoutWidth]);
    };

    return nav;
}
