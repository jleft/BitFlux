(function(d3, fc) {
    'use strict';

    sc.util.calculateDimensions = function(container, secondaryChartShown) {
        var headRowHeight = parseInt(container.select('#head-row').style('height'), 10) +
            parseInt(container.select('#head-row').style('padding-top'), 10) +
            parseInt(container.select('#head-row').style('padding-bottom'), 10);
        var navHeight = parseInt(container.select('#nav-row').style('height'), 10);

        var useableScreenHeight = window.innerHeight - headRowHeight - navHeight;

        var primaryHeightRatio = secondaryChartShown ? 2 : 1;
        var secondaryHeightRatio = secondaryChartShown ? 1 : 0;

        var totalHeightRatio = primaryHeightRatio + secondaryHeightRatio;

        container.select('#primary-row')
            .style('height', primaryHeightRatio * useableScreenHeight / totalHeightRatio + 'px');
        container.select('#secondary-row')
            .style('height', secondaryHeightRatio * useableScreenHeight / totalHeightRatio + 'px');
    };

})(d3, fc);