(function(d3, fc, sc) {
    'use strict';
    sc.util.domain.padYDomain = function(yExtent, paddingPercentage) {
        var paddingArray = paddingPercentage.length ?
            [paddingPercentage[0], paddingPercentage[1]] : [paddingPercentage, paddingPercentage];
        var variance = yExtent[1] - yExtent[0];

        return [yExtent[0] - variance * paddingArray[0],
            yExtent[1] + variance * paddingArray[1]];
    };
})(d3, fc, sc);