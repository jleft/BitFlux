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