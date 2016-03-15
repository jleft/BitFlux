export default function(initialProduct, initialDiscontinuityProvider) {
    return {
        data: [],
        viewDomain: [],
        trackingLatest: true,
        product: initialProduct,
        discontinuityProvider: initialDiscontinuityProvider
    };
}
