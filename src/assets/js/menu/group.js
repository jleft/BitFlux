(function(d3, fc, sc) {
    'use strict';

    sc.menu.group = function() {

        var dispatch = d3.dispatch('optionChange');

        var option;
        var generator;

        function group(selection) {
            var optionGenerator = generator.on('optionChange', function(option) {
                    dispatch.optionChange(option);
                });

            selection.each(function() {
                var selection = d3.select(this)
                    .datum(option);
                selection.call(optionGenerator);
            });
        }

        group.option = function() {
            if (!arguments.length) {
                return option;
            }
            option = [];
            for (var i = 0; i < arguments.length; i++) {
                option.push(arguments[i]);
            }
            return group;
        };

        group.generator = function(x) {
            if (!arguments.length) {
                return generator;
            }
            generator = x;
            return group;
        };

        d3.rebind(group, dispatch, 'on');

        return group;
    };
})(d3, fc, sc);