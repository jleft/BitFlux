(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.trackingLatestData = function(domain, data) {
        var dataExtent = fc.util.extent(data, 'date');
        var latestViewedTime = d3.max(domain.map(function(d) { return d.getTime(); }));
        var latestDatumTime = dataExtent[1].getTime();
        return latestViewedTime === latestDatumTime;
    };
})(d3, fc, sc);