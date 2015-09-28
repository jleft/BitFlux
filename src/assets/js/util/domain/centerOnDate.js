(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.centerOnDate = function(domain, data, centerDate) {
        var dataExtent = fc.util.extent(data, 'date');
        var domainTimeExtent = (domain[1].getTime() - domain[0].getTime()) / 1000;

        var centeredDataDomain = [d3.time.second.offset(centerDate, -domainTimeExtent / 2),
            d3.time.second.offset(centerDate, domainTimeExtent / 2)];
        var timeShift = 0;
        if (centeredDataDomain[1].getTime() > dataExtent[1].getTime()) {
            timeShift = (dataExtent[1].getTime() - centeredDataDomain[1].getTime()) / 1000;
        } else if (centeredDataDomain[0].getTime() < dataExtent[0].getTime()) {
            timeShift = (dataExtent[0].getTime() - centeredDataDomain[0].getTime()) / 1000;
        }

        return [d3.time.second.offset(centeredDataDomain[0], timeShift),
            d3.time.second.offset(centeredDataDomain[1], timeShift)];
    };
})(d3, fc, sc);