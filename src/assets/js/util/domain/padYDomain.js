(function(d3, fc, sc) {
    'use strict';
    sc.util.domain.padYDomain = function(yExtent, paddingPercentage) {
        var paddingArray = Array.isArray(paddingPercentage) ?
            paddingPercentage : [paddingPercentage, paddingPercentage];
        var orderedYExtentDifference = yExtent[1] - yExtent[0];

        return [yExtent[0] - orderedYExtentDifference * paddingArray[0],
            yExtent[1] + orderedYExtentDifference * paddingArray[1]];
    };
}(d3, fc, sc));
