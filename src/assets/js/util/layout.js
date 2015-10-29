(function(d3, fc, sc) {
    'use strict';

    sc.util.layout = function(containers, charts) {
        var secondaryChartsShown = 0;
        for (var j = 0; j < charts.secondaries.length; j++) {
            if (charts.secondaries[j]) {
                secondaryChartsShown++;
            }
        }
        containers.secondaries
            .filter(function(d, i) { return i < secondaryChartsShown; })
            .style('flex', '1');
        containers.secondaries
            .filter(function(d, i) { return i >= secondaryChartsShown; })
            .style('flex', '0');

        var headRowHeight = parseInt(containers.app.select('.head-row').style('height'), 10) +
            parseInt(containers.app.select('.head-row').style('padding-top'), 10) +
            parseInt(containers.app.select('.head-row').style('padding-bottom'), 10) +
            parseInt(containers.app.select('.head-row').style('margin-bottom'), 10);

        var useableScreenHeight = window.innerHeight - headRowHeight;

        containers.charts
            .style('height', useableScreenHeight + 'px');

        charts.xAxis.dimensionChanged(containers.xAxis);
        charts.navbar.dimensionChanged(containers.navbar);
        charts.primary.dimensionChanged(containers.primary);
    };
})(d3, fc, sc);
