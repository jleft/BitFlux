(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.trackingLatestData = function(domain, data) {
        var latestViewedTime = d3.max(domain, function(d) { return d.getTime(); });
        var latestDatumTime = d3.max(data, function(d) { return d.date.getTime(); });
        return latestViewedTime === latestDatumTime;
    };
})(d3, fc, sc);