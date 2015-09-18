(function(d3, fc, sc) {
    'use strict';

    sc.chart.foreground = function() {
        var topMargin = 0,
            rightMargin = 0,
            bottomMargin = 0,
            leftMargin = 0;

        var createForeground = fc.util.dataJoin()
            .selector('rect.foreground')
            .element('rect')
            .attr('class', 'foreground');

        function foreground(selection) {
            createForeground(selection, [selection.datum()])
                .layout({
                    position: 'absolute',
                    top: topMargin,
                    right: rightMargin,
                    bottom: bottomMargin,
                    left: leftMargin
                });

            selection.layout();
        }

        foreground.topMargin = function(x) {
            if (!arguments.length) {
                return topMargin;
            }
            topMargin = x;
            return foreground;
        };

        foreground.rightMargin = function(x) {
            if (!arguments.length) {
                return rightMargin;
            }
            rightMargin = x;
            return foreground;
        };

        foreground.bottomMargin = function(x) {
            if (!arguments.length) {
                return bottomMargin;
            }
            bottomMargin = x;
            return foreground;
        };

        foreground.leftMargin = function(x) {
            if (!arguments.length) {
                return leftMargin;
            }
            leftMargin = x;
            return foreground;
        };

        return foreground;
    };
})(d3, fc, sc);