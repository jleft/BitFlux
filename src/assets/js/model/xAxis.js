(function(d3, fc, sc) {
    'use strict';

    sc.model.xAxis = function(initialPeriod) {
        return {
            viewDomain: [],
            period: initialPeriod,
            width: undefined
        };
    };

})(d3, fc, sc);
