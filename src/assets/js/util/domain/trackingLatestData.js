(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.trackingLatestData = function(domain, data) {
        var dataExtent = fc.util.extent(data, 'date');
        var latestViewedTime = domain[1].getTime();
        var latestDatumTime = dataExtent[1].getTime();
        return latestViewedTime === latestDatumTime;
    };
})(d3, fc, sc);