(function(d3, fc, sc) {
    'use strict';

    sc.menu.group = function() {

        var dispatch = d3.dispatch('optionChange');

        var optionList;
        var generator;

        function group(selection) {
            var propagatedDatum = selection.datum() || {};
            propagatedDatum.optionList = optionList;
            var optionGenerator = generator.on('optionChange', function(option) {
                    dispatch.optionChange(option);
                });

            selection.each(function() {
                var selection = d3.select(this)
                    .datum(propagatedDatum);
                selection.call(optionGenerator);
            });
        }

        /**
        * Builds the group option list from a single collection of entities.
        *
        * @param {Object} arrayOfEntity - collection of the entity which will
        *               become the exhaustive list of group options.
        * @param {Function} entityAdaptor - a function taking an entity as a
        *               parameter and returning an option.
        * NB: Temporarily, the method can leverage Javascript weak typing by
        *   passing an array of Options and an Identity adaptor.
        *   This should be removed as soon as every source of options is defined as entities.
        */
        group.formOptionListFromCollection = function(arrayOfEntity, entityAdaptor) {
            optionList = arrayOfEntity.map(function(entity) {
                return entityAdaptor(entity);
            });
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
