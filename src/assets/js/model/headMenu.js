(function(d3, fc, sc) {
    'use strict';

    sc.model.headMenu = function(initialProducts, initialSelectedProduct, initialSelectedPeriod) {
        return {
            products: initialProducts,
            selectedProduct: initialSelectedProduct,
            selectedPeriod: initialSelectedPeriod
        };
    };

})(d3, fc, sc);
