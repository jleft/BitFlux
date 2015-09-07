(function(d3, fc, sc) {
    'use strict';

    sc.util.zoomControl = function(zoom, selection, scale) {
        var tx = zoom.translate()[0];

        var xExtent = fc.util.extent(selection.datum().data, ['date']);
        var width = selection.attr('width') || fc.util.innerDimensions(selection.node()).width;
        var min = scale(xExtent[0]);
        var max = scale(xExtent[1]);

        // Don't pan off sides
        if (min >= 0) {
            tx -= min;
        } else if (max - width <= 0) {
            tx -= (max - width);
        }

        // If zooming out, and zoomed out to maximum extent, do nothing
        if (zoom.scale() < 1) {
            if ((min >= 0) && (max - width) <= 0) {
                scale.domain(xExtent);
                zoom.x(scale);
                tx = scale(xExtent[0]);
            }
        }

        zoom.translate([tx, 0]);
    };
})(d3, fc, sc);