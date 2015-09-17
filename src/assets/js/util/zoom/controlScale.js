(function(d3, fc, sc) {
    'use strict';

    sc.util.zoom.controlScale = function(zoom, selection, scale) {
        var tx = zoom.translate()[0];

        var dataModel = selection.datum();
        var width = selection.attr('width') || parseInt(selection.style('width'), 10);
        var xExtent = fc.util.extent(dataModel.data, ['date']);
        var min = scale(xExtent[0]);
        var max = scale(xExtent[1]);

        // If zooming, and about to pan off screen, do nothing
        if (zoom.scale() !== 1) {
            if ((min >= 0) && (max - width) <= 0) {
                scale.domain(xExtent);
                zoom.x(scale);
                tx = scale(xExtent[0]);
                zoom.translate([tx, 0]);
                return true;
            }
        }
        return false;
    };
})(d3, fc, sc);