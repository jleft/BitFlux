(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.moveToLatest = function(domain, data, ratio) {
        if (arguments.length < 3) {
            ratio = 1;
        }
        var dataExtent = fc.util.extent(data, 'date');
        var dataTimeExtent = (dataExtent[1].getTime() - dataExtent[0].getTime()) / 1000;
        var domainTimeExtent = ratio * (domain[1].getTime() - domain[0].getTime()) / 1000;
        var latest = data[data.length - 1].date;
        var scaledLiveDataDomain = domainTimeExtent < dataTimeExtent ?
            [d3.time.second.offset(latest, -domainTimeExtent), latest] : dataExtent;
        return scaledLiveDataDomain;
    };

})(d3, fc, sc);