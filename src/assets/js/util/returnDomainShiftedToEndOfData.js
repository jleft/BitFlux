(function(d3, fc, sc) {
    'use strict';
    sc.util.returnDomainShiftedToEndOfData = function(domain, data) {
        var extentTime = domain[1].getTime() - domain[0].getTime();
        var latestDate = data[data.length - 1].date;
        return [new Date(latestDate.getTime() - extentTime), latestDate];
    };

})(d3, fc, sc);