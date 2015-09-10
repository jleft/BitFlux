(function(d3, fc, sc) {
    'use strict';
    sc.util.domain.padYDomain = function(domain, paddingPercentage) {
        var paddedDomain = [];
        var variance = domain[1] - domain[0];
        paddedDomain[0] = domain[0] - variance * paddingPercentage;
        paddedDomain[1] = domain[1] + variance * paddingPercentage;
        return paddedDomain;
    };

})(d3, fc, sc);