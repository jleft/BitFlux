(function(d3, fc, sc) {
    'use strict';

    sc.util.zoom.controlPan = function(zoom, selection, scale) {
        var tx = zoom.translate()[0];

        var dataModel = selection.datum();
        var width = selection.attr('width') || parseInt(selection.style('width'), 10);
        var xExtent = fc.util.extent(dataModel.data, ['date']);
        var min = scale(xExtent[0]);
        var max = scale(xExtent[1]);

        // Don't pan off sides
        if (min > 0) {
            tx -= min;
        } else if (max - width < 0) {
            tx -= (max - width);
        }

        zoom.translate([tx, 0]);
    };
})(d3, fc, sc);