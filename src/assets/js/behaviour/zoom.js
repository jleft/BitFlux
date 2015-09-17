(function(d3, fc, sc) {
    'use strict';

    sc.behaviour.zoom = function(scale) {

        var dispatch = d3.dispatch('zoomed');

        var zoomBehaviour = d3.behavior.zoom();
        var zoomScale = scale;

        var allowPan = true;
        var allowScalable = true;

        function zoom(selection) {

            zoomBehaviour.x(zoomScale)
                .on('zoom', function() {
                    var scaleControlled = sc.util.zoom.controlScale(zoomBehaviour, selection, zoomScale);
                    sc.util.zoom.controlPan(zoomBehaviour, selection, zoomScale);

                    var panned = (zoomBehaviour.scale() === 1)  && !scaleControlled;
                    var scaled = (zoomBehaviour.scale() !== 1) || scaleControlled;
                    if ((panned && allowPan) || (scaled && allowScalable)) {
                        dispatch.zoomed(zoomScale.domain());
                    }
                });

            selection.call(zoomBehaviour);
        }

        zoom.allowPan = function(x) {
            if (!arguments.length) {
                return allowPan;
            }
            allowPan = x;
            return zoom;
        };
        zoom.allowScalable = function(x) {
            if (!arguments.length) {
                return allowScalable;
            }
            allowScalable = x;
            return zoom;
        };

        d3.rebind(zoom, dispatch, 'on');

        return zoom;
    };
})(d3, fc, sc);