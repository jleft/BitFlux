(function(d3, fc) {
    'use strict';

    sc.util.calculateDimensions = function(container, secondaryChartShown) {
        var leftPadding = parseInt(container.select('.col-md-12').style('padding-left'), 10);
        var rightPadding = parseInt(container.select('.col-md-12').style('padding-right'), 10);

        var headRowHeight = parseInt(container.select('#head-row').style('height'), 10) +
            parseInt(container.select('#head-row').style('margin-top'), 10) +
            parseInt(container.select('#head-row').style('margin-bottom'), 10);
        var navHeight = parseInt(container.select('svg.nav').style('height'), 10);

        var useableScreenWidth = parseInt(container.style('width'), 10) - (leftPadding + rightPadding);
        var useableScreenHeight = window.innerHeight - headRowHeight - navHeight;

        var primaryHeightRatio = secondaryChartShown ? 2 : 1;
        var secondaryHeightRatio = secondaryChartShown ? 1 : 0;

        var totalHeightRatio = primaryHeightRatio + secondaryHeightRatio;

        container.select('svg.primary').attr('width', useableScreenWidth)
            .attr('height', primaryHeightRatio * useableScreenHeight / totalHeightRatio);
        container.select('svg.secondary').attr('width', useableScreenWidth)
            .attr('height', secondaryHeightRatio * useableScreenHeight / totalHeightRatio);
        container.select('svg.nav').attr('width', useableScreenWidth);
    };

})(d3, fc);