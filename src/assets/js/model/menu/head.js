export default function(initialProducts, initialSelectedProduct, initialSelectedPeriod) {
    return {
        productConfig: {
            title: null,
            careted: true,
            listIcons: false,
            icon: false
        },
        products: initialProducts,
        selectedProduct: initialSelectedProduct,
        selectedPeriod: initialSelectedPeriod
    };
}
