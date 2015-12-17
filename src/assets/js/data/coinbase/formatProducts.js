import model from '../../model/model';

export default function(products, source, defaultPeriods, productPeriodOverrides) {
    var formattedProducts = products.map(function(product) {
        if (productPeriodOverrides.has(product.id)) {
            return {
                id: product.id,
                display: product.id,
                periods: productPeriodOverrides.get(product.id),
                source: source
            };
        } else {
            return {
                id: product.id,
                display: product.id,
                periods: defaultPeriods,
                source: source
            };
        }
    });

    return formattedProducts.map(model.data.product);
}
