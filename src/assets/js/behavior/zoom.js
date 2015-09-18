(function(d3, fc, sc) {
    'use strict';

    sc.behavior.zoom = function(scale) {

        var dispatch = d3.dispatch('zoom');

        var zoomBehavior = d3.behavior.zoom();
        var zoomScale = scale;

        var allowPan = true;
        var allowZoom = true;

        function controlPan(zoom, selection, scale) {
            var tx = zoom.translate()[0];

            var width = selection.attr('width') || parseInt(selection.style('width'), 10);
            var xExtent = fc.util.extent(selection.datum().data, ['date']);
            var min = scale(xExtent[0]);
            var max = scale(xExtent[1]);

            // Don't pan off sides
            if (min > 0) {
                tx -= min;
            } else if (max - width < 0) {
                tx -= (max - width);
            }

            zoom.translate([tx, 0]);
        }

        function controlZoom(zoom, selection, scale) {
            var tx = zoom.translate()[0];

            var width = selection.attr('width') || parseInt(selection.style('width'), 10);
            var xExtent = fc.util.extent(selection.datum().data, ['date']);
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
        }

        function zoom(selection) {
            zoomBehavior.x(zoomScale)
                .on('zoom', function() {
                    var maxDomainViewed = controlZoom(zoomBehavior, selection, zoomScale);
                    controlPan(zoomBehavior, selection, zoomScale);

                    var domain = zoomScale.domain();
                    if (selection.datum().trackingLive && (zoomBehavior.scale() > 1)) {
                        domain = sc.util.domain.moveToLatest(zoomScale.domain(), selection.datum().data);
                    }

                    var panned = (zoomBehavior.scale() === 1)  && !maxDomainViewed;
                    var zoomed = (zoomBehavior.scale() !== 1) || maxDomainViewed;
                    if ((panned && allowPan) || (zoomed && allowZoom)) {
                        dispatch.zoom(domain);
                    }
                });

            selection.call(zoomBehavior);
        }

        zoom.allowPan = function(x) {
            if (!arguments.length) {
                return allowPan;
            }
            allowPan = x;
            return zoom;
        };
        zoom.allowZoom = function(x) {
            if (!arguments.length) {
                return allowZoom;
            }
            allowZoom = x;
            return zoom;
        };

        d3.rebind(zoom, dispatch, 'on');

        return zoom;
    };
})(d3, fc, sc);