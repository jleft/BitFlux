(function(d3, fc, sc) {
    'use strict';
    /**
    * @param {Object} config - object providing parameters.
    * config.display: sets the display string for the product.
    * config.priceFormat: sets the format string for the prices with this product.
    * config.volumeFormat: sets the format string for the volumes with this product.
    * NB: each parameter is optional, but the default value are not necessarily useful.
    */
    var productFactory = function(config) {
        return {
            display: config.display || 'Unspecified Product',
            priceFormat: d3.format(config.priceFormat || '.2f'),
            volumeFormat: d3.format(config.volumeFormat || 's'),
            getPeriods: function() {
                var self = this;
                var result = productPeriodAssociation
                    .filter(function(x) { return x.product === self; })
                    .map(function(x) { return x.period; });
                return result;
            }
        };
    };

    sc.model.products = [];

    sc.model.product.generated = productFactory({
        display: 'Data Generator',
        volumeFormat: '.3s'
    });
    sc.model.product.bitcoin = productFactory({
        display: 'Bitcoin',
        volumeFormat: '.2f'
    });

    sc.model.products.push(sc.model.product.generated);
    sc.model.products.push(sc.model.product.bitcoin);

    var productPeriodAssociation = [];

    function addAssociation(product, period) {
        productPeriodAssociation.push({product: product, period: period});
    }

    addAssociation(sc.model.product.generated, sc.model.period.day1);
    addAssociation(sc.model.product.bitcoin, sc.model.period.hour1);
    addAssociation(sc.model.product.bitcoin, sc.model.period.minute5);
    addAssociation(sc.model.product.bitcoin, sc.model.period.minute1);

})(d3, fc, sc);
