(function(d3, fc, sc) {
    'use strict';

    sc.util.domain.filterDataInDateRange = function(domain, data) {
        // Calculate visible data, given [startDate, endDate]
        var bisector = d3.bisector(function(d) { return d.date; });
        var filteredData = data.slice(
            // Pad and clamp the bisector values to ensure extents can be calculated
            Math.max(0, bisector.left(data, domain[0]) - 1),
            Math.min(bisector.right(data, domain[1]) + 1, data.length)
        );
        return filteredData;
    };
})(d3, fc, sc);