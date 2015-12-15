import model from '../../model/model';

export default function(source, minute1, minute5, hour1, day1, response) {
    var products = response.map(function(product) {
        // TODO: use factory - are these right?
        // are price and volume format okay?
        if (product.id !== 'BTC-USD') {
            return {
                id: product.id,
                display: product.id,
                priceFormat: 's',
                volumeFormat: '.2f',
                periods: [hour1, day1],
                source: source
            };
        } else {
            return {
                id: product.id,
                display: product.id,
                priceFormat: 's',
                volumeFormat: '.2f',
                periods: [minute1, minute5, hour1, day1],
                source: source
            };
        }
    });

    // Format the new products correctly
    return products.map(model.data.product);
}
