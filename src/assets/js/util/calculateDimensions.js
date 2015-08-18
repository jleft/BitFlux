(function(d3, fc) {
    'use strict';

    sc.util.calculateDimensions = function(container) {
        var leftPadding = parseInt(container.select('.col-md-12').style('padding-left'), 10);
        var rightPadding = parseInt(container.select('.col-md-12').style('padding-right'), 10);

        var headRowHeight = parseInt(container.select('#head-row').style('height'), 10);
        var navHeight = parseInt(container.select('svg.nav').style('height'), 10);

        var useableScreenWidth = parseInt(container.style('width'), 10) - (leftPadding + rightPadding);
        var useableScreenHeight = window.innerHeight - headRowHeight - navHeight -
            2 * fc.chart.linearTimeSeries().xAxisHeight();

        var targetWidth = useableScreenWidth;
        var targetHeight = useableScreenHeight;

        var mainHeightRatio = 0.6;
        var rsiHeightRatio = 0.3;
        var totalHeightRatio = mainHeightRatio + rsiHeightRatio;

        container.select('svg.primary').attr('width', targetWidth)
            .attr('height', mainHeightRatio * targetHeight / totalHeightRatio);
        container.select('svg.rsi').attr('width', targetWidth)
            .attr('height', rsiHeightRatio * targetHeight / totalHeightRatio);
        container.select('svg.nav').attr('width', targetWidth);
    };

})(d3, fc);