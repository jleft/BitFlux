(function(d3, fc, sc) {
    'use strict';

    sc.util.layout = function(container, secondaryCharts) {
        var secondaryChartsShown = 0;
        for (var j = 0; j < secondaryCharts.length; j++) {
            if (secondaryCharts[j]) {
                secondaryChartsShown++;
            }
        }
        container.selectAll('.secondary-row')
            .filter(function(d, i) { return i < secondaryChartsShown; })
            .attr('layout-style', 'flex: 1');
        container.selectAll('.secondary-row')
            .filter(function(d, i) { return i >= secondaryChartsShown; })
            .attr('layout-style', 'flex: 0');

        var headRowHeight = parseInt(container.select('.head-row').style('height'), 10) +
            parseInt(container.select('.head-row').style('padding-top'), 10) +
            parseInt(container.select('.head-row').style('padding-bottom'), 10) +
            parseInt(container.select('.head-row').style('margin-bottom'), 10);

        var useableScreenHeight = window.innerHeight - headRowHeight;

        container.select('#charts-container')
            .style('height', useableScreenHeight)
            .layout();
    };
})(d3, fc, sc);
