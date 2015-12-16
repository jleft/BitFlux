import model from '../../model/model';

export default function(products, source, defaults, exceptions) {
    var formattedProducts = products.map(function(product) {
        if (exceptions.has(product.id)) {
            return {
                id: product.id,
                display: product.id,
                periods: exceptions.get(product.id),
                source: source
            };
        } else {
            return {
                id: product.id,
                display: product.id,
                periods: defaults,
                source: source
            };
        }
    });

    return formattedProducts.map(model.data.product);
}
