(function(d3, fc) {
    'use strict';

    sc.util.zoomControl = function(zoom, selection, data, scale) {
        var tx = zoom.translate()[0];
        var ty = zoom.translate()[1];

        var xExtent = fc.util.extent(data, ['date']);
        var min = scale(xExtent[0]);
        var max = scale(xExtent[1]);

        // Don't pan off sides
        var width = selection.attr('width');
        if (min > 0) {
            tx -= min;
        } else if (max - width < 0) {
            tx -= (max - width);
        }
        // If zooming, and about to pan off screen, do nothing
        if (zoom.scale() !== 1) {
            if ((min >= 0) && (max - width) <= 0) {
                scale.domain(xExtent);
                zoom.x(scale);
                tx = scale(xExtent[0]);
            }
        }

        zoom.translate([tx, ty]);
    };
})(d3, fc);