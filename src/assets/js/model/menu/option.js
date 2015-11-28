(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.option = function(displayString, valueString, option) {
        return {
            displayString: displayString, // TODO: is 'displayName' better?
            valueString: valueString, // TODO: is this an id?
            option: option, // TODO: Ideally, remove.
            isSelected: false
        };
    };

})(d3, fc, sc);
