(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.trackingLatestData = function(domain, data) {
        var latestViewedTime = domain[1].getTime();
        var lastDatumTime = data[data.length - 1].date.getTime();
        return latestViewedTime === lastDatumTime;
    };
})(d3, fc, sc);