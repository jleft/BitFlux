(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.option = function(displayString, valueString, option, icon) {
        return {
            displayString: displayString, // TODO: is 'displayName' better?
            valueString: valueString, // TODO: is this an id?
            option: option, // TODO: Ideally, remove.
            isSelected: false,
            icon: icon
        };
    };

})(d3, fc, sc);
