(function() {
    'use strict';

    // Crazyness to get a strict mode compliant reference to the global object
    var global = null;
    /* jshint ignore:start */
    global = (1, eval)('this');
    /* jshint ignore:end */

    global.sc = {
        behavior: {},
        chart: {
            secondary: {}
        },
        data: {
            feed: {
                coinbase: {}
            }
        },
        menu: {
            data: {},
            generator: {},
            primary: {},
            secondary: {}
        },
        model: {
            chart: {},
            data: {},
            menu: {}
        },
        series: {},
        util: {
            domain: {}
        }
    };
}());
