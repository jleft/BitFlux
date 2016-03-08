export default function(initialProduct, initialDiscontinuity) {
    return {
        data: [],
        viewDomain: [],
        trackingLatest: true,
        product: initialProduct,
        discontinuity: initialDiscontinuity
    };
}
