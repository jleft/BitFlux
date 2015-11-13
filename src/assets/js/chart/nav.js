(function(d3, fc, sc) {
    'use strict';

    sc.chart.nav = function() {
        var dispatch = d3.dispatch(
            sc.event.viewChange,
            sc.event.resetToLatest);

        var navChart = fc.chart.cartesian(fc.scale.dateTime(), d3.scale.linear())
            .yTicks(0)
            .margin({
                bottom: 40
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
                selection.enter()
                    .select('.e')
                    .append('circle')
                    .attr('cy', 34)
                    .attr('r', 7)
                    .attr('class', 'outer-handle');
                selection.enter()
                    .select('.e')
                    .append('circle')
                    .attr('cy', 34)
                    .attr('r', 4)
                    .attr('class', 'inner-handle');
                selection.enter()
                    .select('.w')
                    .append('circle')
                    .attr('cy', 34)
                    .attr('r', 7)
                    .attr('class', 'outer-handle');
                selection.enter()
                    .select('.w')
                    .append('circle')
                    .attr('cy', 34)
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

        function nav(selection) {
            var navbarContainer = selection.select('#navbar-container');
            var navbarReset = selection.select('#navbar-reset');
            var model = navbarContainer.datum();

            viewScale.domain(model.viewDomain);

            var resetButton = navbarReset.selectAll('g')
                .data([model]);

            resetButton.enter()
                .append('g')
                .attr('class', 'reset-button')
                .on('click', function() { dispatch[sc.event.resetToLatest](); })
                .append('path')
                .attr('d', 'M1.5 1.5h13.438L23 20.218 14.937 38H1.5l9.406-17.782L1.5 1.5z');

            resetButton.classed('active', !model.trackingLatest);

            var filteredData = sc.util.domain.filterDataInDateRange(
                fc.util.extent().fields('date')(model.data),
                model.data);
            var yExtent = fc.util.extent()
                .fields(['low', 'high'])(filteredData);

            navChart.xDomain(fc.util.extent().fields('date')(model.data))
                .yDomain(yExtent);

            brush.on('brush', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] !== 0) {
                    dispatch[sc.event.viewChange]([brush.extent()[0][0], brush.extent()[1][0]]);
                }
            })
            .on('brushend', function() {
                if (brush.extent()[0][0] - brush.extent()[1][0] === 0) {
                    dispatch[sc.event.viewChange](sc.util.domain.centerOnDate(viewScale.domain(),
                        model.data, brush.extent()[0][0]));
                }
            });

            navChart.plotArea(navMulti);
            navbarContainer.call(navChart);

            // Allow to zoom using mouse, but disable panning
            var zoom = sc.behavior.zoom(layoutWidth)
                .scale(viewScale)
                .trackingLatest(model.trackingLatest)
                .allowPan(false)
                .on('zoom', function(domain) {
                    dispatch[sc.event.viewChange](domain);
                });

            navbarContainer.select('.plot-area').call(zoom);
        }

        d3.rebind(nav, dispatch, 'on');

        nav.dimensionChanged = function(container) {
            layoutWidth = parseInt(container.style('width'));
            viewScale.range([0, layoutWidth]);
        };

        return nav;
    };
})(d3, fc, sc);
