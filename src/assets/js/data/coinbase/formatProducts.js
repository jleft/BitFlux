import model from '../../model/model';

export default function(source, minute1, minute5, hour1, day1, response) {
    var products = response.map(function(product) {
        if (product.id !== 'BTC-USD') {
            return {
                family: 'bitcoin',
                display: product.id,
                volumeFormat: '.2f',
                periods: [hour1, day1],
                source: source
            };
        } else {
            return {
                family: 'bitcoin',
                display: product.id,
                volumeFormat: '.2f',
                periods: [minute1, minute5, hour1, day1],
                source: source
            };
        }
    });

    // Format the new products correctly
    return products.map(model.data.product);
}
