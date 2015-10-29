(function(d3, fc, sc) {
    'use strict';
    var renderedOnce = false;

    sc.util.layout = function(containers, charts) {

        function getSecondaryContainer(i) {
            return containers.secondaries.filter(function(d, i) {return i === iChart; });
        }

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

        var headRowHeight = parseInt(containers.app.select('.head-row').style('height'), 0);
        if (!renderedOnce) {
            headRowHeight +=
                parseInt(containers.app.select('.head-row').style('padding-top'), 0) +
                parseInt(containers.app.select('.head-row').style('padding-bottom'), 0) +
                parseInt(containers.app.select('.head-row').style('margin-bottom'), 0);
            renderedOnce = true;
        }

        var useableScreenHeight = window.innerHeight - headRowHeight;

        containers.charts
            .style('height', useableScreenHeight + 'px');

        charts.xAxis.dimensionChanged(containers.xAxis);
        charts.navbar.dimensionChanged(containers.navbar);
        charts.primary.dimensionChanged(containers.primary);
        for (var iChart = 0; iChart < charts.secondaries.length; iChart++) {
            charts.secondaries[iChart].option.dimensionChanged(getSecondaryContainer(iChart));
        }
    };
})(d3, fc, sc);
