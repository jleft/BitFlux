(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.head = function(initialProducts, initialSelectedProduct, initialSelectedPeriod) {
        return {
            products: initialProducts,
            selectedProduct: initialSelectedProduct,
            selectedPeriod: initialSelectedPeriod
        };
    };

})(d3, fc, sc);
